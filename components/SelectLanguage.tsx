import React, { Dispatch } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LanguageType, VoiceType } from "@/types";
import { cn } from "@/lib/utils";
import { languageTypeCategoris } from "@/constants";

const SelectLanguage = ({setLanguageType}:{setLanguageType:Dispatch<React.SetStateAction<LanguageType | null>>}) => {
  return (
    <Select onValueChange={(value: LanguageType) => setLanguageType(value)}>
      <SelectTrigger
        className={cn(
          "text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1"
        )}
      >
        <SelectValue
          placeholder="Chọn ngôn ngữ"
          className="placeholder:text-gray-1"
        />
      </SelectTrigger>
      <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus-visible:ring-offset-orange-1">
        {languageTypeCategoris.map((language) => (
          <SelectItem
            key={language.value}
            value={language.value}
            className="capitalize focus:bg-orange-1"
          >
            {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectLanguage;
