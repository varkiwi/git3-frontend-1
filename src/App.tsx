import * as React from "react";
import { hot } from "react-hot-loader";
import { GitContainer } from "containers/GitContainer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header } from "layouts/Header";
import { ThemeProvider } from "@mui/material";
import { defaultTheme } from "layouts/theme";
import { AppContainer } from "layouts/AppContainer";
import { Dashboard } from "pages/Dashboard";
import { Code } from "pages/Code";
import { Issue } from "pages/Issue";
import { RepoNav } from "layouts/RepoNav";
import { NewIssue } from "pages/NewIssue";
import { PreviewIssue } from "pages/PreviewIssue";

class App extends React.Component<Record<string, unknown>, undefined> {
  public render() {
    return (
      <GitContainer.Provider>
        <ThemeProvider theme={defaultTheme}>
          <Router>
            <Header />
            <AppContainer>
              <RepoNav />
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/repo" component={Code} />
                <Route exact path="/repo/:name" component={Code} />
                <Route exact path="/issues" component={Issue} />
                <Route exact path="/issues/new" component={NewIssue} />
                <Route exact path="/issues/:id" component={PreviewIssue} />
              </Switch>
            </AppContainer>
          </Router>
        </ThemeProvider>
      </GitContainer.Provider>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
