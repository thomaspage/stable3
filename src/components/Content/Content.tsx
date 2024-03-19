import { ContentContainer } from "./Content.styles";
import { ContentTypes } from "./Content.types";

const Content = ({children}: ContentTypes) => {
  return (
    <ContentContainer children={children} />
  );
};

export default Content;
