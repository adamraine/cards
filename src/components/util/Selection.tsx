import React from 'react';

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
    isSelected: value => value === selected,
    toggleSelected: value => {
      setSelected(s => {
        if (value === s) {
          return null;
        }
        return value;
      });
    },
  }), []);

  return [selected, group];
}

export function SelectionItem<V>(props: {
  className?: string,
  selectedClassName?: string,
  children: React.ReactNode,
  value: V,
  group: SelectionGroup<V>
}):React.ReactElement {
  const classList = [props.className || ''];
  if (props.group.isSelected(props.value)) classList.push(props.selectedClassName || '');
  
  return (
    <span className={classList.join(' ')} onClick={() => props.group.toggleSelected(props.value)}>
      {props.children}
    </span>
  );
}
