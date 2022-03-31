import * as React from "react";
import { hot } from "react-hot-loader";
import { GitContainer } from "containers/GitContainer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header } from "layouts/Header";
import { ThemeProvider } from "@mui/material";
import { defaultTheme } from "layouts/theme";
import { AppContainer } from "layouts/AppContainer/styled";
import { Dashboard } from "pages/Dashboard";
import { Code } from "pages/Code";
import { Issue } from "pages/Issue";
import { RepoNav } from "layouts/RepoNav";
import { WalletContainer } from "containers/WalletContainer";
import { NewIssue } from "pages/Issue/subpages/NewIssue";
import { PreviewIssue } from "pages/Issue/subpages/PreviewIssue";

class App extends React.Component<Record<string, unknown>, undefined> {
  public render() {
    return (
      <GitContainer.Provider>
        <WalletContainer.Provider>
          <ThemeProvider theme={defaultTheme}>
            <Router>
              <Header />
              <AppContainer>
                <RepoNav />
                <Switch>
                  <Route exact path="/" component={Dashboard} />
                  <Route path="/:repoAddress/:repoName/repo" component={Code} />
                  <Route
                    exact
                    path="/:repoAddress/:repoName/repo/:file"
                    component={Code}
                  />
                  <Route
                    exact
                    path="/:repoAddress/:repoName/issues"
                    component={Issue}
                  />
                  <Route
                    exact
                    path="/:repoAddress/:repoName/issues/new"
                    component={NewIssue}
                  />
                  <Route
                    exact
                    path="/:repoAddress/:repoName/issues/:id"
                    component={PreviewIssue}
                  />
                </Switch>
              </AppContainer>
            </Router>
          </ThemeProvider>
        </WalletContainer.Provider>
      </GitContainer.Provider>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
