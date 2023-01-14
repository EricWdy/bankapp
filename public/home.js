function Home() {

  return (
    <Card 
        txtcolor="black"
        header="Home Page"
        title="Welcome to the Bank"
        text="For all your banking needs"
        width="20em"
        body={(<img src="bank.png" className="img-fluid" alt="Responsive image" />)}
        
    />
  );
}
