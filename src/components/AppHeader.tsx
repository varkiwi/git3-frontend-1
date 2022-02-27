import React from "react";

import { GitContainer } from "containers/GitContainer";

const Test: React.FC = () => {
  console.log('asdfas');
  const { gitFactory } = GitContainer.useContainer();
  gitFactory
    .getRepositoryNames()
    .then((repoNames: any) => {
      console.log(repoNames);
    })
    .then((data: any) => {
      console.log(data);
    });

  return <div>asdfasdfasd</div>;
}

export default Test;
