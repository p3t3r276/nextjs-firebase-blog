import { Tag } from "@/utils/post.model";
import React from "react";
import CreatableSelect from 'react-select/creatable';

const TagSelection = ({
  value,
  defaultValue,
  onChange,
}: {value: Tag[], defaultValue: Tag[], onChange: (value: string) => void}) => {
  // Convert post tag to 
  const defaultValue = defaultValue.map((tag => tag.id))
  return (
    
  );
};

export default TagSelection;