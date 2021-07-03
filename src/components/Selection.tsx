import React from 'react';
import styles from './Selection.module.scss';

interface SelectionContext<V> {
  selected: Set<V>,
  toggleSelected: (node: V) => void
}

export function useSelectionGroup<V>():React.Context<SelectionContext<V>> {
  return React.useMemo(() => {
    return React.createContext<SelectionContext<V>>({
      selected: new Set(),
      toggleSelected: () => undefined,
    });
  }, []);
}

export const SelectionItem = <V,>(props: {
  children: React.ReactNode,
  value: V,
  group: React.Context<SelectionContext<V>>
}):React.ReactElement => {
  const {selected, toggleSelected} = React.useContext(props.group);
  const isSelected = selected.has(props.value);
  
  const classList = [styles.SelectionItem];
  if (isSelected) classList.push(styles.selected);
  
  return (
    <span className={classList.join(' ')} onClick={() => toggleSelected(props.value)}>
      <span className={styles.container}>
        {props.children}
      </span>
    </span>
  );
};

export const Selection = <V,>(props:{
  children: React.ReactNode,
  onChange: (selected: Set<V>) => void,
  group: React.Context<SelectionContext<V>>
}):React.ReactElement => {
  const [selected, setSelected] = React.useState<Set<V>>(new Set());

  // Memoize so consumers are not always re-rendered.
  const providerValue = React.useMemo<SelectionContext<V>>(() => ({
    selected,
    toggleSelected: value => {
      setSelected(s => {
        const set = new Set(s);
        if (set.has(value)) {
          set.delete(value);
        } else {
          set.add(value);
        }
        props.onChange(set);
        return set;
      });
    },
  }), [selected]);
  
  return (
    <props.group.Provider value={providerValue}>
      {props.children}
    </props.group.Provider>
  );
};
