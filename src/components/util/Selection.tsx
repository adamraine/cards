import React from 'react';
import styles from './Selection.module.scss';

interface SelectionGroup<V> {
  isSelected: (node: V) => boolean,
  toggleSelected: (node: V) => void
}

export function useCheckboxGroup<V>() : [V[], SelectionGroup<V>] {
  const [selected, setSelected] = React.useState<Set<V>>(new Set());
  const group = React.useMemo<SelectionGroup<V>>(() => ({
    isSelected: () => false,
    toggleSelected: value => {
      setSelected(s => {
        const set = new Set(s);
        if (set.has(value)) {
          set.delete(value);
        } else {
          set.add(value);
        }
        return set;
      });
    },
  }), []);

  // Set this function out here so we don't trigger a re-render every time.
  group.isSelected = value => selected.has(value);

  return [Array.from(selected), group];
}

export function useRadioGroup<V>() : [V|null, SelectionGroup<V>] {
  const [selected, setSelected] = React.useState<V|null>(null);
  const group = React.useMemo<SelectionGroup<V>>(() => ({
    isSelected: () => false,
    toggleSelected: value => {
      setSelected(s => {
        if (value === s) {
          return null;
        }
        return value;
      });
    },
  }), []);

  // Set this function out here so we don't trigger a re-render every time.
  group.isSelected = value => value === selected;

  return [selected, group];
}

export const SelectionItem = <V,>(props: {
  children: React.ReactNode,
  value: V,
  group: SelectionGroup<V>
}):React.ReactElement => {
  const classList = [styles.SelectionItem];
  if (props.group.isSelected(props.value)) classList.push(styles.selected);
  
  return (
    <span className={classList.join(' ')} onClick={() => props.group.toggleSelected(props.value)}>
      <span className={styles.container}>
        {props.children}
      </span>
    </span>
  );
};

/* export const Selection = <V,>(props:{
  children: React.ReactNode,
  onChange: (selected: Set<V>) => void,
  group: React.Context<SelectionGroup<V>>
}):React.ReactElement => {
  const [selected, setSelected] = React.useState<Set<V>>(new Set());
  React.useEffect(() => props.onChange(selected), [selected]);

  // Memoize so consumers are not always re-rendered.
  const providerValue = React.useMemo<SelectionGroup<V>>(() => ({
    selected,
    toggleSelected: value => {
      setSelected(s => {
        const set = new Set(s);
        if (set.has(value)) {
          set.delete(value);
        } else {
          set.add(value);
        }
        return set;
      });
    },
  }), [selected]);
  
  return (
    <props.group.Provider value={providerValue}>
      {props.children}
    </props.group.Provider>
  );
}; */
