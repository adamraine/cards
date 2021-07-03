import React from 'react';
import styles from './Radio.module.scss';

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
  
  function toggle() {
    if (isSelected) {
      setValue(null);
    } else {
      setValue(props.value);
    }
  }

  return (
    <span className={classList.join(' ')} onClick={toggle}>
      <span className={styles.container}>
        {props.children}
      </span>
    </span>
  );
};

export const Radio = <V,>(props:{
  children: React.ReactNode,
  onChange: (selected: V|null) => void,
  group: React.Context<RadioContext<V>>
}):React.ReactElement => {
  const [value, setValue] = React.useState<V|null>(null);
  React.useEffect(() => props.onChange(value), [value]);

  // Memoize so consumers are not always re-rendered.
  const providerValue = React.useMemo<RadioContext<V>>(() => ({
    value,
    setValue: v => {
      setValue(v);
    },
  }), [value, setValue]);
  
  return (
    <props.group.Provider value={providerValue}>
      {props.children}
    </props.group.Provider>
  );
};
