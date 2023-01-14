function Spa() {
  const [login, setLogin] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  return (
    <HashRouter>
      <UserContext.Provider
        value={{
          loginState: login,
          userName: userName,
          updateLogin: setLogin,
          updateName: setUserName,
        }}
      >
        <Navbar />
        <div className="container" style={{ padding: "20px" }}>
          <Route path="/" exact component={Home} />
          <Route path="/login/" component={Login} />
          <Route path="/createaccount/" component={CreateAccount} />
          <Route path="/deposit/" component={Deposit} />
          <Route path="/withdraw/" component={Withdraw} />
          <Route path="/alldata/" component={AllData} />
        </div>
      </UserContext.Provider>
    </HashRouter>
  );
}

ReactDOM.render(<Spa />, document.getElementById("root"));
