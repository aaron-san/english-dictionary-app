import React, { useEffect, useRef, useState } from "react";
import { IDefaults, IWord, IWords } from "../types";
import AddWord, { FormValues } from "./AddWord";
// import { v4 as uuidv4 } from "uuid";
import Form from "./Form";

const SearchResults = ({
  wordsList,
  setWordsList,
  addWord,
  setAddWord,
  searchWord,
}: // setSearchWord,
IWords) => {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // const [showSearchBox, setShowSearchBox] = useState<boolean>(true)
  // const [searchWord, setSearchWord] = useState<string>("");
  const [editWordMode, setEditWordMode] = useState<boolean>(false);
  const [idToEdit, setIdToEdit] = useState<string | null>(null);

  const handleDelete = async (word: string, id: string) => {
    // console.log(id);

    const deleteWord = window.prompt(
      `Delete ${word}? \n\nType 'DELETE' to delete`
    );
    if (deleteWord !== "DELETE") return;
    // Delete data on the backend via PUT
    try {
      await fetch(`http://localhost:3000/words/${id}`, {
        method: "DELETE",
      });

      // Get updated words list from json server
      const getWords = async () => {
        const data = await fetch("http://localhost:3000/words");
        const words = await data.json();
        setWordsList(words);
      };
      getWords();
    } catch (err) {
      console.log(err);
    }
  };

  // Add throttle (delay) to onChange handler
  // const [filteredWords, setFilteredWords] = useState<IWord[]>([]);

  // const doWordFilter = (e: string) => {
  //   if (!e) return setFilteredWords([]);

  //   setTimeout(() => {
  //     console.log("====>", e);
  //     setFilteredWords(
  //       wordsList.filter((el) => el.word.toLowerCase().includes(searchWord))
  //     );
  //   }, 1);
  // };

  // const [addWord, setAddWord] = useState<boolean>(false);

  return (
    <div className="max-w-2xl mx-auto p-4  mt-4 max-h-[400px] overflow-auto border-x-2 border-slate-100">
      <div className="flex flex-col justify-start gap-4  ">
        <div className="flex items-start justify-center gap-4"></div>
        <AddWord
          wordsList={wordsList}
          setWordsList={setWordsList}
          addWord={addWord}
          setAddWord={setAddWord}
        />
      </div>
      {/* Search Results */}
      <div className="flex justify-center gap-2 mt-4">
        {!editWordMode && (
          <div className="flex flex-wrap max-w-[800px] gap-4 justify-center min-w-[300px] mx-auto">
            {wordsList
              ?.filter((d) => {
                return searchWord
                  ? d.word?.toLowerCase().includes(searchWord.toLowerCase())
                  : "";
              })
              .map((e) => {
                // Return editable input fields
                return (
                  <div
                    key={e.id}
                    className="border rounded-md border-slate-200 max-w-[300px] flex justify-start flex-wrap flex-col mx-auto min-w-[200px] bg-slate-600/60 h-fit"
                  >
                    <div className="p-2 text-xl border-b border-1 w-fill text-slate-900 border-slate-200 bg-slate-100/80 rounded-t-md">
                      {e.word}
                    </div>
                    {/* <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2 px-2"></div> */}
                    {e.definition && (
                      <>
                        <div className="px-2 my-2 text-lg text-yellow-100">
                          {e.definition}
                        </div>
                        <div className="w-[90%] h-[1px] px-2 bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2"></div>
                      </>
                    )}

                    {e.pronunciation && (
                      <>
                        <div className="px-2 my-2 text-lg text-gray-100">
                          {e.pronunciation}
                        </div>
                        <div className="w-[90%] h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2"></div>
                      </>
                    )}

                    {e.example && (
                      <>
                        <div className="px-2 my-2 text-lg text-pink-100">
                          {e.example}
                        </div>
                        <div className="flex items-center justify-between"></div>
                      </>
                    )}
                    <div className="flex items-center justify-end gap-2 px-2">
                      <button
                        className="px-4 py-1 m-4 max-w-[100px] w-[80%] border border-slate-100 text-slate-100 rounded-md hover:bg-slate-600"
                        onClick={() => {
                          setIdToEdit(e.id);

                          setEditWordMode(!editWordMode);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="w-8 h-8 px-2 py-1 m-1 text-sm text-red-200 border border-red-200 rounded-full hover:bg-slate-600"
                        onClick={() => handleDelete(e.word, e.id)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        {/* Form - Edit Word */}
        {editWordMode &&
          wordsList
            .filter((el) => el.id === idToEdit)
            .map((el) => {
              const defaults: IDefaults = {
                defaultWord: el.word,
                defaultDefinition: el.definition,
                defaultPronunciation: el.pronunciation,
                defaultExample: el.example,
                defaultMark: el.mark,
              };
              // console.log(defaults);

              return (
                <div key={el.id} className="">
                  <Form
                    setWordsList={setWordsList}
                    setAddWord={setAddWord}
                    setEditWordMode={setEditWordMode}
                    // setSearchWord={setSearchWord}
                    defaults={defaults}
                    idToEdit={idToEdit}
                    methodType="PUT"
                  />
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default SearchResults;
