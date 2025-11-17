import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="text-2xl text-red-500" >
      Hi there
    </div>
  );
}
