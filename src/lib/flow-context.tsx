"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import type { Answers } from "./eligibility";
import type { QuestionId } from "./questions";

interface FlowState {
  answers: Answers;
}

type FlowAction =
  | { type: "SET_ANSWER"; id: QuestionId; value: string }
  | { type: "RESET" };

function reducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "SET_ANSWER":
      return { answers: { ...state.answers, [action.id]: action.value } };
    case "RESET":
      return { answers: {} };
    default:
      return state;
  }
}

interface FlowContextValue {
  answers: Answers;
  setAnswer: (id: QuestionId, value: string) => void;
  reset: () => void;
}

const FlowContext = createContext<FlowContextValue | undefined>(undefined);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { answers: {} });

  const value = useMemo<FlowContextValue>(
    () => ({
      answers: state.answers,
      setAnswer: (id, v) => dispatch({ type: "SET_ANSWER", id, value: v }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [state.answers],
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow(): FlowContextValue {
  const ctx = useContext(FlowContext);
  if (!ctx) {
    throw new Error("useFlow must be used inside <FlowProvider>");
  }
  return ctx;
}
