import { useState } from "react";

const initialExpenseItems = [
  { id: 11001, name: "Shopping", cost: 1500 },
  { id: 11002, name: "Transportation", cost: 900 },
  { id: 11003, name: "Fuel", cost: 600 },
];

export default function App() {
  const [expenseItems, setExpenseItems] = useState(initialExpenseItems);
  const [budget, setTotalBudget] = useState(20000);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [searchedValue, setSearchedValue] = useState("default");

  const spent = expenseItems.reduce((acc, curr) => acc + curr.cost, 0);

  const remaining = budget - spent;

  function handleTotalBudget() {
    const newBudget = Number(prompt("Enter new budget"));
    setTotalBudget(!isNaN(newBudget) && newBudget !== 0 ? newBudget : budget);
  }

  function handleSetName(e) {
    setName(e.target.value);
  }

  function handleSetCost(e) {
    setCost(!isNaN(Number(e.target.value)) ? Number(e.target.value) : "");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (cost === 0) return;

    const newItem = {
      name,
      cost,
      id: crypto.randomUUID(),
    };

    setName("");
    setCost("");
    setExpenseItems((cur) => [newItem, ...cur]);
  }

  function handleDelete(id) {
    setExpenseItems((cur) => cur.filter((item) => item.id !== id));
  }

  function handleSearch(e) {
    setSearchedValue(e.target.value);
  }

  let sortedItems;

  if (searchedValue === "asc") {
    sortedItems = expenseItems.slice().sort((a, b) => a.cost - b.cost);
  }

  if (searchedValue === "desc") {
    sortedItems = expenseItems.slice().sort((a, b) => b.cost - a.cost);
  }

  if (searchedValue === "default") {
    sortedItems = expenseItems;
  }

  return (
    <div className="container">
      <div className="main-app">
        <Header
          spent={spent}
          totalBudget={budget}
          remaining={remaining}
          onUpdateBudget={handleTotalBudget}
        />

        <SearchBar searchedValue={searchedValue} onSearch={handleSearch} />

        {sortedItems.map((item) => (
          <ExpenseItem item={item} onDelete={handleDelete} key={item.id} />
        ))}

        {expenseItems.length === 0 && <Empty />}

        <AddExpense
          name={name}
          cost={cost}
          onSetName={handleSetName}
          onSetCost={handleSetCost}
          onAdd={handleSubmit}
        />
      </div>
    </div>
  );
}

function Header({ spent, totalBudget, remaining, onUpdateBudget }) {
  return (
    <>
      <h4 className="app-heading text-center mt-5">My Budget Planner</h4>
      <div className="cost-summary mt-4">
        <CostSummary className="budget">
          <p>Budget: ৳ {totalBudget}</p>
          <button onClick={onUpdateBudget}>Edit</button>
        </CostSummary>

        <CostSummary className="remaining">
          <p>Remaining: ৳ {remaining}</p>
        </CostSummary>

        <CostSummary className="spent-so-far">
          <p>Spent so far: ৳ {spent}</p>
        </CostSummary>
      </div>
    </>
  );
}

function CostSummary({ children, className }) {
  return <div className={className}>{children}</div>;
}

function ExpenseItem({ item, onDelete }) {
  return (
    <div className="expense-item mb-2">
      <p>{item.name}</p>
      <div className="expense-item-buttons">
        <p className="expense-item-cost">৳ {item.cost}</p>
        <p className="expense-item-btn" onClick={() => onDelete(item.id)}>
          &times;
        </p>
      </div>
    </div>
  );
}

function SearchBar({ searchedValue, onSearch }) {
  return (
    <>
      <h5 className="mt-4">Expenses</h5>
      <div className="search-box mt-3 mb-4">
        <select value={searchedValue} onChange={onSearch}>
          <option value="default">Sort by price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>
    </>
  );
}

function AddExpense({ name, cost, onSetName, onSetCost, onAdd }) {
  return (
    <>
      <h5 className="mt-4 mb-3">Add Expense</h5>
      <form onSubmit={onAdd}>
        <div className="inputs mb-3">
          <input
            type="text"
            placeholder="Expense name"
            value={name}
            onChange={onSetName}
          />
          <input
            type="text"
            placeholder="Cost"
            value={cost}
            onChange={onSetCost}
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </>
  );
}

function Empty() {
  return (
    <p className="alert alert-danger">Add some new budgets to your planner.</p>
  );
}
