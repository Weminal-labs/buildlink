import remarkGfm from "remark-gfm";
import ActionCard from "@/components/common/action-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ReactMarkdown from "react-markdown";

const KEYWORDS = ["linear protocol"];

export const CustomMarkdown = ({
  content,
}: {
  content: string | React.ReactNode;
}) => {
  const renderText = (text: string | React.ReactNode) => {
    if (typeof text !== "string") return text;

    let lastIndex = 0;
    const elements = [];
    const lowerText = text.toLowerCase();

    // Tìm tất cả các từ khóa trong text
    KEYWORDS.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      let match;

      while ((match = regex.exec(text)) !== null) {
        // Thêm text thường trước keyword
        if (match.index > lastIndex) {
          elements.push(
            <span key={`text-${lastIndex}`}>
              {text.slice(lastIndex, match.index)}
            </span>
          );
        }

        // Thêm keyword với highlighting, giữ nguyên định dạng gốc của text
        elements.push(
          <Popover key={`keyword-${match.index}`}>
            <PopoverTrigger>
              <span className="p-1 rounded-sm font-bold text-primary hover:underline cursor-pointer  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                {match[0]}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <ActionCard />
            </PopoverContent>
          </Popover>
        );

        lastIndex = match.index + match[0].length;
      }
    });

    // Thêm phần text còn lại
    if (lastIndex < text.length) {
      elements.push(
        <span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>
      );
    }

    return elements.length > 0 ? elements : text;
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        strong: ({ node, ...props }) => (
          <strong className="font-bold text-primary animate-pulse">
            {renderText(props.children as string | React.ReactNode)}
          </strong>
        ),
      }}
    >
      {content as string}
    </ReactMarkdown>
  );
};
