// Create the hero component with a search bar using shadcn
'use client'
import { Button } from "@/components/ui/button"

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command"
import SearchBar from "./SearchBar";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
  
type recType = {
    name: string;
    url: string;
}

export default function Hero(props: {urlSetter: Dispatch<SetStateAction<string>>}) {
    const [repoUrl, setRepoUrl] = useState<string>("");
    const searchBarRef = useRef<HTMLInputElement | null>(null);
    const recommendations = useRef<recType[]>([
        {
            name: "Supabase",
            url: "https://github.com/supabase/supabase",
        },
        {
            name: "FastAPI",
            url: "https://github.com/fastapi/fastapi",
        },
        {
            name: "Doom",
            url: "https://github.com/id-Software/DOOM"
        },
        {
            name: "Yummy",
            url: "https://github.com/id-Software/DOOM"
        },
    ]);

    const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRepoUrl(event.target.value); 
    }, []);

    const onSubmitUrl = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.urlSetter(repoUrl);
    }, []);

    const onClickRecommendation = useCallback((url: string) => {
        setRepoUrl(url);
        if (searchBarRef.current) {
            searchBarRef.current?.focus();
            searchBarRef.current.value = url;
        }
    }, []);

    return (
      <div
        className="flex flex-col items-center justify-center text-center
            w-5/6 h-[80svh] bg-[#4A665A]/[.18] rounded-3xl gap-y-5"
      >
        {/* Header */}
        <div>
          <h1>GIT NYOM</h1>
          <p> Nyom your repo to generate snack-sized insights and stories. </p>
        </div>

        {/* Search bar */}
        <form
          className="w-1/2 flex flex-row items-center gap-x-3"
          onSubmit={onSubmitUrl}
        >
          <SearchBar onChangeCallBack={onSearchChange} inputRef={searchBarRef}/>
          <Button type="submit" className="flex-none h-full hover:opacity-90">
            Nyom
          </Button>
        </form>

        {/* Recommendations */}
        <div className="w-1/2 flex flex-row items-center justify-start gap-x-3">
          {recommendations.current.map((rec, i) => (
            <div
              key={rec.name + i}
              className="flex justify-center items-center w-32 h-10 bg-[#4A665A]/[.18]
                rounded-lg hover:cursor-pointer hover:bg-[#4A665A]/[.38] transition"
                onClick={() => onClickRecommendation(rec.url)}
            >
              {rec.name}
            </div>
          ))}
        </div>
      </div>
    );
}