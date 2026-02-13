"use client";
import { Dispatch, SetStateAction } from "react";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function TransactionsTable({ isOpen, setIsOpen }: Props) {
  return <div>hi</div>;
}
