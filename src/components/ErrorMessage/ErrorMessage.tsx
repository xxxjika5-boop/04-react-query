import css from "./ErrorMessage.module.css";

export default function ErrorMessage({ text }: { text: string }) {
  return <p className={css.message}>{text}</p>;
}
