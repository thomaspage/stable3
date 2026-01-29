import { ContentContainer } from "./Content.styles";
import { ContentTypes } from "./Content.types";

/**
 * Simple wrapper component for page content
 * Provides consistent styling for all page content
 */
const Content = ({ children }: ContentTypes) => {
  return <ContentContainer>{children}</ContentContainer>;
};

export default Content;
