import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ReadingTracker() {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const getInitialData = (key) => JSON.parse(localStorage.getItem(key)) || { book: "", pages: Array(7).fill(0) };
  const [nas, setNas] = useState(getInitialData("nas"));
  const [viv, setViv] = useState(getInitialData("viv"));
  const [futureBooksNas, setFutureBooksNas] = useState(JSON.parse(localStorage.getItem("futureBooksNas")) || []);
  const [completedBooksNas, setCompletedBooksNas] = useState(JSON.parse(localStorage.getItem("completedBooksNas")) || []);
  const [futureBooksViv, setFutureBooksViv] = useState(JSON.parse(localStorage.getItem("futureBooksViv")) || []);
  const [completedBooksViv, setCompletedBooksViv] = useState(JSON.parse(localStorage.getItem("completedBooksViv")) || []);

  useEffect(() => {
    localStorage.setItem("nas", JSON.stringify(nas));
    localStorage.setItem("viv", JSON.stringify(viv));
    localStorage.setItem("futureBooksNas", JSON.stringify(futureBooksNas));
    localStorage.setItem("completedBooksNas", JSON.stringify(completedBooksNas));
    localStorage.setItem("futureBooksViv", JSON.stringify(futureBooksViv));
    localStorage.setItem("completedBooksViv", JSON.stringify(completedBooksViv));
  }, [nas, viv, futureBooksNas, completedBooksNas, futureBooksViv, completedBooksViv]);

  const addEntry = (user, setUser, index, pagesRead) => {
    const updatedPages = [...user.pages];
    updatedPages[index] = pagesRead;
    setUser({ ...user, pages: updatedPages });
  };

  const chartData = daysOfWeek.map((day, index) => ({
    day,
    Nas: nas.pages[index],
    Viv: viv.pages[index],
  }));

  return (
    <div className="p-8 min-h-screen bg-pastel flex flex-col gap-6 items-center text-center">
      <h1 className="text-4xl font-bold">📚 Reading Tracker: Nas & Viv 📚</h1>
      <div className="grid grid-cols-2 gap-6 w-full max-w-5xl">
        {[{ name: "Nas", user: nas, setUser: setNas }, { name: "Viv", user: viv, setUser: setViv }].map(({ name, user, setUser }) => (
          <Card key={name} className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold">📖 {name}'s Section</h2>
            <Input
              placeholder="Current Book"
              value={user.book}
              onChange={(e) => setUser({ ...user, book: e.target.value })}
              className="mt-2"
            />
            <table className="mt-4 w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  {daysOfWeek.map((day) => (
                    <th key={day} className="border p-2">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {user.pages.map((pages, index) => (
                    <td key={index} className="border p-2">
                      <Input
                        type="number"
                        value={pages}
                        onChange={(e) => addEntry(user, setUser, index, Number(e.target.value))}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <Button className="mt-4" onClick={() => alert("Pages saved!")}>Enter</Button>
            <p className="mt-4 font-semibold">Total Pages Read This Week: {user.pages.reduce((a, b) => a + b, 0)}</p>
          </Card>
        ))}
      </div>
      <h2 className="text-xl font-semibold mt-6">📊 Weekly Progress Chart</h2>
      <ResponsiveContainer width="80%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Nas" fill="#ff6b6b" name="Nas" />
          <Bar dataKey="Viv" fill="#4d96ff" name="Viv" />
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-6 w-full max-w-5xl mt-6">
        {[{ name: "Nas", future: futureBooksNas, completed: completedBooksNas, setFuture: setFutureBooksNas, setCompleted: setCompletedBooksNas },
          { name: "Viv", future: futureBooksViv, completed: completedBooksViv, setFuture: setFutureBooksViv, setCompleted: setCompletedBooksViv }]
          .map(({ name, future, completed, setFuture, setCompleted }) => (
            <Card key={name} className="p-6 bg-white shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold">📚 {name}'s Book Tracker</h2>
              <div className="mt-2">
                <h3 className="text-lg font-medium">📅 Future Books</h3>
                <Input
                  placeholder="Add a book"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value) {
                      setFuture([...future, e.target.value]);
                      e.target.value = "";
                    }
                  }}
                  className="mt-2"
                />
                <ul className="mt-2 text-left">
                  {future.map((book, index) => (
                    <li key={index} className="text-gray-600">• {book}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">✅ Completed Books</h3>
                <Input
                  placeholder="Add a completed book"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value) {
                      setCompleted([...completed, e.target.value]);
                      e.target.value = "";
                    }
                  }}
                  className="mt-2"
                />
                <ul className="mt-2 text-left">
                  {completed.map((book, index) => (
                    <li key={index} className="text-gray-600">📖 {book}</li>
                  ))}
                </ul>
              </div>
            </Card>
        ))}
      </div>
    </div>
  );
}
