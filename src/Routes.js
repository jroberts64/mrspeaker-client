import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import ResetPassword from "./containers/ResetPassword";
import Signup from "./containers/Signup";
import NewDoc from "./containers/NewDoc";
import Docs from "./containers/Docs";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default function Routes({ appProps }) {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={Home} appProps={appProps} />
      <UnauthenticatedRoute path="/login" exact component={Login} appProps={appProps} />
      <UnauthenticatedRoute path="/signup" exact component={Signup} appProps={appProps} />
      <AuthenticatedRoute path="/docs/new" exact component={NewDoc} appProps={appProps} />
      <AuthenticatedRoute path="/docs/:id" exact component={Docs} appProps={appProps} />
      { /* Finally, catch all unmatched routes */}
      <Route component={NotFound} />
    </Switch>
  );
}