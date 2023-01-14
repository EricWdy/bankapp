function Navbar() {
  const context = React.useContext(UserContext);

  console.log("Log in status: ", context.loginState);
  console.log("Log in user: ", context.userName);

  function handleLogout() {
    // Google authentication logout
    auth.signOut();

    // change local state from context
    context.updateLogin(false);
    context.updateName("");
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <a href="#" className="navbar-brand">
          BadBank
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                href="#/login/"
                className="nav-link"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Log in so that we can better serve you"
              >
                Login
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#/createaccount/"
                className="nav-link"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Start your journey from creating an account!"
              >
                Create Account
              </a>
            </li>

            {context.loginState ? (
              <>
                <li className="nav-item">
                  <a href="#/deposit/" className="nav-link">
                    Deposit
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#/withdraw/" className="nav-link">
                    Withdraw
                  </a>
                </li>

                <li className="nav-item">
                  <a href="#/alldata/" className="nav-link">
                    All data
                  </a>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
        {context.loginState ? (
          <div align={"right"}>
          <div className={"text-primary"} style={{display:"inline-block",marginRight:"1em"}}>
            Welcome, {context.userName}!
          </div>
          <div style={{display:"inline-block"}}></div>
          <div style={{display:"inline-block"}}>
            <button className="btn btn-outline-primary" onClick={handleLogout}>
              Log out
            </button>
          </div>
          </div>
        ) : (
          <div align={"right"}>Welcome, Guest!</div>
        )}
      </div>
    </nav>
  );
}
