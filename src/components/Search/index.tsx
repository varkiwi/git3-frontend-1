import { InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { CustomizedAutocomplete } from "./styled";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useHistory } from "react-router-dom";
import { GitContainer } from "containers/GitContainer";
import { SearchOptions } from "interfaces/SearchOptions";

export const Search: React.FC = () => {
  const history = useHistory();
  const { gitFactory } = GitContainer.useContainer();

  const [autocompleteKey, setAutocompleteKey] = useState<number>(1);

  const handleOptionChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: SearchOptions,
  ) => {
    history.push(`/${value.address}/${value.repoName}/repo`);
    setOptions([]);
    setAutocompleteKey(Math.random);
    localStorage.clear();
  };

  const [options, setOptions] = useState<Array<SearchOptions>>([]);

  let optionText = "No results. Type 4 characters.";

  const searchRepository = (event: React.SyntheticEvent, userInput: string) => {
    if (userInput === undefined || userInput === null || userInput.length < 4) {
      return;
    } else {
      optionText = "Loading...";
    }
    gitFactory
      .getRepositoryNames()
      .then((repoNames: []) => {
        // and filter based on the search entered by the user
        // TODO: overtime, we should go over all possible repositories and not only the
        // first one get all user addresses who have a repository by the first name
        const filteredRepoNames = repoNames.filter((entry: string) =>
          entry.toLowerCase().startsWith(userInput.toLowerCase()),
        );
        return Promise.all([
          gitFactory.getRepositoriesUserList(filteredRepoNames[0]),
          filteredRepoNames[0],
        ]);
      })
      .then(([userList, filteredRepoName]: any) => {
        const resultArray: Array<SearchOptions> = [];
        userList.map((userAddress: string) => {
          resultArray.push({
            label: `${userAddress.substring(0, 6)}..${userAddress.substring(
              37,
            )}/${filteredRepoName}`,
            address: userAddress,
            repoName: filteredRepoName,
          });
        });
        setOptions(resultArray);
      });
  };

  return (
    <CustomizedAutocomplete
      key={autocompleteKey}
      disableClearable
      options={options}
      noOptionsText={optionText}
      onInputChange={searchRepository}
      onChange={(e, value) => handleOptionChange(e, value as SearchOptions)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search repository"
          size="small"
          InputProps={{
            ...params.InputProps,
            type: "search",
            endAdornment: (
              <InputAdornment position="end">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};
