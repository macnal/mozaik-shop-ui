import {Stack} from "@mui/material"
import {createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState} from "react";

type Id = string | number;

const ListSelectContext = createContext<[Id[], Dispatch<SetStateAction<Id[]>>]>([[], () => {
}]);

// export const useRadioSelect = () => {
//   const [selected, setSelected] = useContext(ListSelectContext);
//
//   const isSelected = (x: Id) => selected.includes(x)
//
//   const toggle = (x: Id) => setSelected(
//     selected => isSelected(x) ? selected.filter((y) => x !== y) : [...selected, x],
//   )
//
//
//   return [isSelected, toggle] as const
// }

export const RadioWithButtonsContext = ({children, initialValue = []}: PropsWithChildren<{ initialValue?: Id[] }>) => {
  const [selected, setSelected] = useState<Id[]>(initialValue);

  return <ListSelectContext value={[selected, setSelected]}>
    {children}
  </ListSelectContext>
}

export const RadioWithButtons = ({children}: PropsWithChildren) => {


  return <RadioWithButtonsContext>
    <Stack>
      {children}
    </Stack>
  </RadioWithButtonsContext>
}
