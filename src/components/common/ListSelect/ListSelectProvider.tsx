'use client';

import {createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState} from "react";

type Id = string | number;


const ListSelectContext = createContext<[Id[], Dispatch<SetStateAction<Id[]>>]>([[], () => {
}]);

export const useListSelect = () => {
  const [selected, setSelected] = useContext(ListSelectContext);

  const isSelected = (x: Id) => selected.includes(x)

  const toggle = (x: Id) => setSelected(
    selected => isSelected(x) ? selected.filter((y) => x !== y) : [...selected, x],
  )


  return [isSelected, toggle] as const
}

export const ListSelectProvider = ({children, initialValue = []}: PropsWithChildren<{ initialValue: Id[] }>) => {
  const [selected, setSelected] = useState<Id[]>(initialValue);

  return <ListSelectContext value={[selected, setSelected]}>
    {children}
  </ListSelectContext>
}
