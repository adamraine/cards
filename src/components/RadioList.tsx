import React from 'react';
import styles from './RadioList.module.scss';

interface RadioContext<V> {
  value: V|null,
  setValue: (node: V|null) => void
}

export function useRadioGroup<V>():React.Context<RadioContext<V>> {
  return React.useMemo(() => {
    return React.createContext<RadioContext<V>>({value: null, setValue: () => undefined});
  }, []);
}

export const RadioItem = <V,>(props: {
  children: React.ReactNode,
  value: V,
  group: React.Context<RadioContext<V>>
}):React.ReactElement => {
  const {value, setValue} = React.useContext(props.group);
  const isSelected = value === props.value;
  
  const classList = [styles.RadioItem];
  if (isSelected) classList.push(styles.selected);

  return (
    <span className={classList.join(' ')} onClick={() => setValue(props.value)}>
      <span className={styles.container}>
        {props.children}
      </span>
    </span>
  );
};

export const RadioList = <V,>(props:{
  children: React.ReactNode,
  onChange: (selected: V|null) => void,
  group: React.Context<RadioContext<V>>
}):React.ReactElement => {
  const [value, setValue] = React.useState<V|null>(null);

  // Memoize so consumers are not always re-rendered.
  const providerValue = React.useMemo<RadioContext<V>>(() => ({
    value,
    setValue: v => {
      props.onChange(v);
      setValue(v);
    },
  }), [value, setValue]);
  
  return (
    <props.group.Provider value={providerValue}>
      {props.children}
    </props.group.Provider>
  );
};
