import React from 'react';
import styles from './SelectionList.module.scss';

interface Selection {
  selected: Set<React.ReactNode>,
  toggleSelected: (node: React.ReactNode) => void
}

export const SelectionContext = React.createContext<Selection>({selected: new Set(), toggleSelected: () => undefined});

export const SelectionItem:React.FC<{children: React.ReactNode}> = props => {
  const {selected, toggleSelected} = React.useContext(SelectionContext);
  const isSelected = selected.has(props.children);
  
  const classList = [styles.SelectionItem];
  if (isSelected) classList.push(styles.selected);

  return (
    <span className={classList.join(' ')} onClick={() => toggleSelected(props.children)}>
      <span className={styles.container}>
        {props.children}
      </span>
    </span>
  );
};

export const SelectionList:React.FC<{onChange: (selected: Selection['selected']) => void}> = props => {
  const [selected, setSelected] = React.useState<Selection['selected']>(new Set());

  const toggleSelected:Selection['toggleSelected'] = (node) => {
    setSelected(s => {
      const set = new Set(s);
      if (set.has(node)) {
        set.delete(node);
      } else {
        set.add(node);
      }
      props.onChange(set);
      return set;
    });
  };
  
  return (
    <SelectionContext.Provider value={{
      selected,
      toggleSelected,
    }}>
      {props.children}
    </SelectionContext.Provider>
  );
};
