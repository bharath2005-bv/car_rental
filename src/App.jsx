import React, { useEffect, useMemo, useState } from "react";

// Single-file React (JavaScript) — Car Rental Frontend (no backend)
// Drop this into a Vite/CRA project's src/App.js (Tailwind optional)

// -------------------------
// Mock data
// -------------------------
const CARS = [
  { id: "c1", brand: "Toyota", model: "Corolla", type: "Sedan", transmission: "Automatic", seats: 5, fuel: "Petrol", pricePerDay: 42, rating: 4.6, location: "Chennai", image: "https://images.unsplash.com/photo-1626072557464-90403d788e8d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VG95b3RhJTIwQ29yb2xsYXxlbnwwfHwwfHx8MA%3D%3D", features: ["Bluetooth", "Rear Camera", "ABS"] },
  { id: "c2", brand: "Hyundai", model: "Creta", type: "SUV", transmission: "Manual", seats: 5, fuel: "Diesel", pricePerDay: 58, rating: 4.4, location: "Bengaluru", image: "https://images.unsplash.com/photo-1633359064754-804ba55e733f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8SHl1bmRhaSUyMENyZXRhfGVufDB8fDB8fHww", features: ["Android Auto", "Hill Assist", "6 Airbags"] },
  { id: "c3", brand: "Maruti", model: "Baleno", type: "Hatchback", transmission: "Automatic", seats: 5, fuel: "Petrol", pricePerDay: 36, rating: 4.2, location: "Hyderabad", image: "https://images.unsplash.com/photo-1663852408695-f57f4d75a536?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFydXRpJTIwc3V6dWtpJTIwY2FyfGVufDB8fDB8fHww", features: ["Apple CarPlay", "LED DRL", "Cruise"] },
  { id: "c4", brand: "Honda", model: "City", type: "Sedan", transmission: "Manual", seats: 5, fuel: "Petrol", pricePerDay: 55, rating: 4.5, location: "Chennai", image: "https://images.unsplash.com/photo-1609676671207-d021525a635d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEhvbmRhJTIwQ2l0eSUyMGNhcnxlbnwwfHwwfHx8MA%3D%3D", features: ["Sunroof", "Lane Watch", "Climate"] },
  { id: "c5", brand: "Tata", model: "Nexon", type: "SUV", transmission: "Automatic", seats: 5, fuel: "EV", pricePerDay: 65, rating: 4.7, location: "Pune", image: "https://images.unsplash.com/photo-1612694303197-6c7c56cda3a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8VGF0YSUyMGNhcnxlbnwwfHwwfHx8MA%3D%3D", features: ["Fast Charge", "ESP", "Auto Hold"] },
  { id: "c6", brand: "Mahindra", model: "Thar", type: "SUV", transmission: "Manual", seats: 4, fuel: "Diesel", pricePerDay: 78, rating: 4.8, location: "Goa", image: "https://images.unsplash.com/photo-1633867179970-c54688bcfa33?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TWFoaW5kcmElMjBUaGFyfGVufDB8fDB8fHww", features: ["4x4", "Removable Top", "Traction"] },
  { id: "c7", brand: "Kia", model: "Seltos", type: "SUV", transmission: "Automatic", seats: 5, fuel: "Petrol", pricePerDay: 62, rating: 4.3, location: "Bengaluru", image: "https://images.unsplash.com/photo-1659406189166-7c17fe5df12a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8S2lhJTIwU2VsdG9zfGVufDB8fDB8fHww", features: ["Ventilated Seats", "HUD", "ADAS"] },
  { id: "c8", brand: "Skoda", model: "Octavia", type: "Sedan", transmission: "Automatic", seats: 5, fuel: "Petrol", pricePerDay: 88, rating: 4.9, location: "Mumbai", image: "https://images.unsplash.com/photo-1541845597-4b8d7bf81ebf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U2tvZGElMjBPY3RhdmlhfGVufDB8fDB8fHww", features: ["DSG", "Virtual Cockpit", "Park Assist"] }
];

const EXTRAS = [
  { id: "gps", label: "GPS Navigation", pricePerDay: 3 },
  { id: "child", label: "Child Seat", pricePerDay: 2 },
  { id: "ins", label: "Full Insurance", pricePerDay: 8 },
  { id: "wifi", label: "In-car Wi‑Fi", pricePerDay: 4 }
];

// -------------------------
// Helpers
// -------------------------
const formatINR = (n) => {
  try { return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }); } catch { return `₹${n}`; }
};
const daysBetween = (start, end) => {
  if (!start || !end) return 1;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.max(0, e - s);
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
const load = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };

// -------------------------
// App
// -------------------------
export default function App() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState("All");
  const [transmission, setTransmission] = useState("All");
  const [fuel, setFuel] = useState("All");
  const [seats, setSeats] = useState("Any");
  const [priceRange, setPriceRange] = useState([20, 100]);
  const [rating, setRating] = useState(0);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [favorites, setFavorites] = useState(() => load("crp:favs", []));
  const [compare, setCompare] = useState([]);
  const [bookings, setBookings] = useState(() => load("crp:bookings", []));

  useEffect(() => save("crp:favs", favorites), [favorites]);
  useEffect(() => save("crp:bookings", bookings), [bookings]);

  const filtered = useMemo(() => {
    return CARS.filter((c) => {
      const q = `${c.brand} ${c.model} ${c.type}`.toLowerCase();
      const matchesQuery = q.includes(query.toLowerCase());
      const matchesLoc = location === "All" || c.location === location;
      const matchesType = type === "All" || c.type === type;
      const matchesT = transmission === "All" || c.transmission === transmission;
      const matchesFuel = fuel === "All" || c.fuel === fuel;
      const matchesSeats = seats === "Any" || c.seats >= Number(seats);
      const matchesPrice = c.pricePerDay >= priceRange[0] && c.pricePerDay <= priceRange[1];
      const matchesRating = c.rating >= rating;
      return matchesQuery && matchesLoc && matchesType && matchesT && matchesFuel && matchesSeats && matchesPrice && matchesRating;
    });
  }, [query, location, type, transmission, fuel, seats, priceRange, rating]);

  const toggleFav = (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const toggleCompare = (id) => setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 3 ? [...c, id] : c));
  const addBooking = (b) => setBookings((bs) => [b, ...bs]);
  const resetAll = () => { setQuery(""); setLocation("All"); setType("All"); setTransmission("All"); setFuel("All"); setSeats("Any"); setPriceRange([20,100]); setRating(0); };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">BV</div>
            <div className="font-semibold">BV Rental</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">India • {bookings.length} trips</div>
            <button className="px-3 py-1 border rounded">Sign in</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-semibold">Find your ride</h1>
            <p className="text-sm text-gray-600">Browse and book cars — fully front-end. LocalStorage stores favorites and bookings.</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="p-2 border rounded" placeholder="Search brand, model, type..." value={query} onChange={(e)=> setQuery(e.target.value)} />
              <input className="p-2 border rounded" type="date" value={pickup} onChange={(e)=> setPickup(e.target.value)} />
              <input className="p-2 border rounded" type="date" value={dropoff} onChange={(e)=> setDropoff(e.target.value)} />
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
              <select className="p-2 border rounded" value={location} onChange={(e)=> setLocation(e.target.value)}>
                {['All','Chennai','Bengaluru','Hyderabad','Pune','Goa','Mumbai'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="p-2 border rounded" value={type} onChange={(e)=> setType(e.target.value)}>
                {['All','Hatchback','Sedan','SUV'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="p-2 border rounded" value={transmission} onChange={(e)=> setTransmission(e.target.value)}>
                {['All','Automatic','Manual'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="p-2 border rounded" value={fuel} onChange={(e)=> setFuel(e.target.value)}>
                {['All','Petrol','Diesel','EV'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="p-2 border rounded" value={seats} onChange={(e)=> setSeats(e.target.value)}>
                {['Any','4','5','6','7'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded" onClick={resetAll}>Reset</button>
                <div className="px-3 py-1 rounded bg-gray-100">{filtered.length} cars</div>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(car => (
                <CarCard key={car.id} car={car} pickup={pickup} dropoff={dropoff} favorite={favorites.includes(car.id)} onToggleFav={()=> toggleFav(car.id)} compare={compare.includes(car.id)} onToggleCompare={()=> toggleCompare(car.id)} onBooked={(b)=> addBooking(b)} />
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full p-6 bg-white border rounded text-center text-gray-600">No cars match your filters.</div>
              )}
            </div>
          </div>

          <aside className="p-4 border rounded h-fit">
            <h3 className="font-medium">Compare ({compare.length})</h3>
            <div className="mt-3 space-y-2">
              {compare.length === 0 && <div className="text-sm text-gray-600">Select up to 3 cars to compare.</div>}
              {compare.map(id => {
                const c = CARS.find(x=> x.id === id);
                return (
                  <div key={id} className="flex items-center justify-between">
                    <div className="text-sm">{c.brand} {c.model}</div>
                    <button className="text-xs text-red-500" onClick={()=> setCompare((arr)=> arr.filter(x=> x!== id))}>Remove</button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <h4 className="font-medium">Favorites</h4>
              <div className="mt-2 space-y-2 text-sm text-gray-700">
                {favorites.length === 0 && <div className="text-gray-500">No favorites yet.</div>}
                {favorites.map(id => {
                  const c = CARS.find(x=> x.id === id);
                  return <div key={id}>{c.brand} {c.model}</div>;
                })}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium">Quick actions</h4>
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-1 border rounded" onClick={()=> { setFavorites([]); setCompare([]); }}>Clear</button>
                <button className="px-3 py-1 border rounded" onClick={()=> window.scrollTo({top:0,behavior:'smooth'})}>Top</button>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">My Bookings</h2>
          <div className="mt-4 space-y-3">
            {bookings.length === 0 && <div className="text-gray-600">You have not made bookings yet.</div>}
            {bookings.map(b => (
              <div key={b.id} className="border rounded p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={b.image} alt="car" className="h-16 w-28 object-cover rounded" />
                  <div>
                    <div className="font-medium">{b.brand} {b.model}</div>
                    <div className="text-sm text-gray-500">{b.pickup} → {b.dropoff} • {b.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="font-semibold">{formatINR(b.total * 100)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      
    </div>
  );
}

// -------------------------
// CarCard + Book`i`ng modal (simple)
// -------------------------
function CarCard({ car, pickup, dropoff, favorite, onToggleFav, compare, onToggleCompare, onBooked }) {
  const [showBook, setShowBook] = useState(false);
  const days = pickup && dropoff ? daysBetween(pickup, dropoff) : 1;
  const estTotal = days * car.pricePerDay;

  return (
    <div className="bg-white border rounded overflow-hidden shadow-sm">
      <div className="h-40 w-full overflow-hidden">
        <img src={car.image} alt="car" className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-medium">{car.brand} {car.model}</div>
            <div className="text-xs text-gray-500">{car.type} • {car.transmission} • {car.fuel}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{formatINR(car.pricePerDay * 100)}/day</div>
            <div className="text-xs text-gray-500">{car.rating}★</div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button className={`px-2 py-1 border rounded text-sm ${compare ? 'bg-gray-100' : ''}`} onClick={onToggleCompare}>{compare ? 'Remove' : 'Compare'}</button>
          <button className="px-2 py-1 border rounded text-sm" onClick={onToggleFav}>{favorite ? '♥' : '♡'}</button>
          <button className="ml-auto px-3 py-1 bg-blue-600 text-white rounded" onClick={()=> setShowBook(true)}>Book</button>
        </div>

        <div className="mt-3 text-xs text-gray-600">Est. total for {days} day(s): <span className="font-medium">{formatINR(estTotal * 100)}</span></div>
      </div>

      {showBook && (
        <BookingModal car={car} pickup={pickup} dropoff={dropoff} onClose={()=> setShowBook(false)} onBooked={(b)=> { onBooked(b); setShowBook(false); }} />
      )}
    </div>
  );
}

function BookingModal({ car, pickup, dropoff, onClose, onBooked }) {
  const [pick, setPick] = useState(pickup || "");
  const [drop, setDrop] = useState(dropoff || "");
  const [loc, setLoc] = useState(car.location);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [driver, setDriver] = useState(false);

  const d = pick && drop ? daysBetween(pick, drop) : 1;
  const extrasPerDay = selectedExtras.reduce((a, id) => a + (EXTRAS.find((e) => e.id === id)?.pricePerDay || 0), 0);
  const total = d * (car.pricePerDay + extrasPerDay) + (driver ? 15 * d : 0);

  const toggleExtra = (id) => setSelectedExtras((x)=> x.includes(id) ? x.filter(i=> i!==id) : [...x,id]);

  const confirm = ()=> {
    const booking = { id: `${car.id}-${Date.now()}`, carId: car.id, brand: car.brand, model: car.model, image: car.image, pickup: pick || new Date().toISOString().slice(0,10), dropoff: drop || new Date(Date.now()+86400000).toISOString().slice(0,10), location: loc, extras: selectedExtras, driver, days: d, total };
    onBooked(booking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded shadow p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Book {car.brand} {car.model}</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs">Pickup</label>
            <input type="date" className="w-full p-2 border rounded" value={pick} onChange={(e)=> setPick(e.target.value)} />
          </div>
          <div>
            <label className="text-xs">Dropoff</label>
            <input type="date" className="w-full p-2 border rounded" value={drop} onChange={(e)=> setDrop(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs">Location</label>
            <select className="w-full p-2 border rounded" value={loc} onChange={(e)=> setLoc(e.target.value)}>
              {['Chennai','Bengaluru','Hyderabad','Pune','Goa','Mumbai'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <div className="font-medium">Extras</div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXTRAS.map(e => (
                <label key={e.id} className={`flex items-center justify-between p-2 border rounded ${selectedExtras.includes(e.id) ? 'bg-gray-50 border-gray-400' : ''}`}>
                  <div>{e.label}</div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-500">{formatINR(e.pricePerDay * 100)}/d</div>
                    <input type="checkbox" checked={selectedExtras.includes(e.id)} onChange={()=> toggleExtra(e.id)} />
                  </div>
                </label>
              ))}

              <label className={`flex items-center justify-between p-2 border rounded ${driver ? 'bg-gray-50 border-gray-400' : ''}`}>
                <div>Chauffeur Driver</div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">{formatINR(1500)}</div>
                  <input type="checkbox" checked={driver} onChange={()=> setDriver(d => !d)} />
                </div>
              </label>
            </div>
          </div>

          <div className="md:col-span-2 border-t pt-3">
            <div className="flex items-center justify-between"><div>Days</div><div className="font-medium">{d}</div></div>
            <div className="flex items-center justify-between"><div>Base ({formatINR(car.pricePerDay * 100)}/d)</div><div className="font-medium">{formatINR(car.pricePerDay * d * 100)}</div></div>
            {selectedExtras.length > 0 && <div className="flex items-center justify-between"><div>Extras</div><div className="font-medium">{formatINR(extrasPerDay * d * 100)}</div></div>}
            {driver && <div className="flex items-center justify-between"><div>Driver</div><div className="font-medium">{formatINR(1500 * d)}</div></div>}
            <div className="mt-2 flex items-center justify-between font-semibold">Total <div>{formatINR(total * 100)}</div></div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-2">
            <button className="px-3 py-1 border rounded" onClick={onClose}>Cancel</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={confirm}>Confirm Booking</button>
          </div>
        </div>
      </div>
    </div>
  );
}
