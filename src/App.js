import './App.css';
import './styles.css';
import Digitbtn from './digitbtn';
import Oprbtn from './Oprbtn';
import { useReducer } from 'react'; 

export const ACTIONS = {
  ADD: 'add-digit',
  CHOOSE_OPR: 'choose-opr',
  CLEAR: 'clear',
  DELETE: 'delete',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload }) {
  switch(type){
    case ACTIONS.ADD:
      if (state.overwrite) {
        return {
          ...state,
          curOpr: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.curOpr === "0") {
        return state
      }
      if (payload.digit === "." && state.curOpr.includes(".")) {
        return state
      }
      return {
        ...state,
        curOpr: `${state.curOpr || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPR:
      if (state.curOpr == null && state.prevOpr == null) {
        return state
      }
      if(state.curOpr == null) {
        return{
        ... state,
        opr: payload.opr,
        }
      }
      if (state.prevOpr == null){
        return {
          ...state,
          opr: payload.opr,
          prevOpr: state.curOpr,
          curOpr: null,
        }
      }
        return {
          ...state,
          prevOpr: evaluate(state),
          opr: payload.opr,
          curOpr: null,
        }
    case ACTIONS.CLEAR: 
      return {}
    case ACTIONS.DELETE:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          curOpr: null
        }
      }
      if (state.curOpr == null) return state
      if (state.curOpr.length === 1 ) {
        return {
          ...state,
          curOpr: null
        }
      }
      return {
        ...state,
        curOpr: state.curOpr.slice(0,-1)
      }
    case ACTIONS.EVALUATE:
      if (
        state.opr == null || 
        state.curOpr == null || 
        state.prevOpr == null
        ) {
          return state
        }

      return {
        ...state,
        overwrite: true,
        prevOpr: null,
        opr: null,
        curOpr: evaluate(state) 
      }
  }
}

function evaluate({ curOpr, prevOpr, opr }) {
  const prev = parseFloat(prevOpr)
  const current = parseFloat(curOpr)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (opr) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
  }
  return computation.toString()
}

const INT_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

const formik = (e) => {
  if (e.key === '1') 
  e.preventDefault();
}

function formtOpr(opr) {
  if (opr == null) return
  const [integer, decimal] = opr.split('.') 
  if (decimal == null) return INT_FORMATTER.format(integer)
  return `${INT_FORMATTER.format(integer)}.${decimal}`
}



function App() {
  const [{curOpr, prevOpr, opr}, dispatch] = useReducer(reducer, {})
  // dispatch({ type: ACTIONS.ADD, payload: { digit:1 }})
  return (
    <>
    <header>
        <h1>Varun's Calculator</h1>
      </header>
    <div className="calc-grid">
      <div className='output' >
        <div className='prev-opr'>{formtOpr(prevOpr)}{opr}</div>
        <div className='cur-opr'>{formtOpr(curOpr)}</div>
      </div>
      <button 
      className='span-two' 
      onClick={() => dispatch({ type:ACTIONS.CLEAR })}>AC</button>
      <button
      onClick={() => dispatch({ type:ACTIONS.DELETE })}>DEL</button>
      <Oprbtn opr="/" dispatch={dispatch}/>
      <Digitbtn onkeypress={formik} digit="1" dispatch={dispatch}/>
      <Digitbtn digit="2" dispatch={dispatch}/>
      <Digitbtn digit="3" dispatch={dispatch}/>
      <Oprbtn opr="*" dispatch={dispatch}/>
      <Digitbtn digit="4" dispatch={dispatch}/>
      <Digitbtn digit="5" dispatch={dispatch}/>
      <Digitbtn digit="6" dispatch={dispatch}/>
      <Oprbtn opr="+" dispatch={dispatch}/>
      <Digitbtn digit="7" dispatch={dispatch}/>
      <Digitbtn digit="8" dispatch={dispatch}/>
      <Digitbtn digit="9" dispatch={dispatch}/>
      <Oprbtn opr="-" dispatch={dispatch}/>
      <Digitbtn digit="." dispatch={dispatch}/>
      <Digitbtn digit="0" dispatch={dispatch}/>
      <button 
      className='span-two'
      onClick={() => dispatch({ type:ACTIONS.EVALUATE })}>=</button>
    </div>
    </>
  );
}

export default App;
