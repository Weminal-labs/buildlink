export interface Message {
  id: string;
  content: string | React.ReactNode;
  sender: "user" | "assistant";
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}
