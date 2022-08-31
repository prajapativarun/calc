import { ACTIONS } from "./App";

export default function Oprbtn({ dispatch, opr }) {
    return <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPR, payload: {opr} })}>{opr}</button>
}