import { useEffect } from "react";

export const useDocumentMetadata = (title: string, description: string) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );

      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      }
    }
  }, [title, description]);
};
