const { createClient } = require("@supabase/supabase-js");
//const supabase = createClient(
//  "https://ekzvjknqvimgfzkklcym.supabase.co",
 // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrenZqa25xdmltZ2Z6a2tsY3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNDk4MTUsImV4cCI6MjA2OTYyNTgxNX0.F7iFXAnOeioJvUphIf20HyBQQs68OzUW_OXurP3fKFI",
// );

const supabase = createClient(
  "https://ilhvzapgsibeitinyleg.supabase.co",
  "sb_publishable_EIp2QOYsfOsfCcANWRMFhA_7f-eRWxP"
)

async function loadVehicles(searchQuery = "") {
  // initial assumption is no searchQuery is provided, so return everything
  let query = supabase.from("vehicles").select("*");
  // during filtered fetch, where searchQuery is something other than none,
  // find all brands and or plates that match the searchQuery
  // - create a query to execute this filter and return op
  // - await results from execution of query
  if (searchQuery) {
    query = query.or(
      `plate.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`,
    );
  }
  // results are eitther, entries (0 or more) or an error..
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching vehicles:", error);
    return;
  }
  // populate table with return from query execution
  const tableBody = document.getElementById("vehicle-table");
  tableBody.innerHTML = "";
  data.forEach((vehicle) => {
    const row = `
     <tr>
        <td>${vehicle.plate}</td>
        <td>${vehicle.brand}</td>
        <td>${vehicle.model}</td>
        <td>${vehicle.year}</td>
        <td>${vehicle.mileage}</td>
        <td>
           <button class="btn btn-sm btn-warning" onclick="editVehicle('${vehicle.id}')">Edit</button>
           <button class="btn btn-sm btn-danger" onclick="deleteVehicle('${vehicle.id}')">Delete</button>
        </td>
</tr>
`;
    tableBody.innerHTML += row;
  });
}

document
  .getElementById("vehicle-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const vehicle = {
      plate: document.getElementById("plate").value,
      brand: document.getElementById("brand").value,
      model: document.getElementById("model").value,
      year: document.getElementById("year").value,
      mileage: parseInt(document.getElementById("mileage").value),
    };
    const { error } = await supabase.from("vehicles").insert([vehicle]);
    if (error) {
      console.error("Error adding vehicle:", error);
      return;
    }
    document.getElementById("vehicle-form").reset();
    loadVehicles(); // Display updated vehicle list
  });

async function deleteVehicle(id) {
  // select all entries from vehicle table with id matching id argument value, and delete them
  // return signal to tell if there was any error carrying out delete operation
  // refresh display to reflect updated tables after delete operation
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) {
    console.error(`Error deleting vehicle: `, error);
    return;
  }
  loadVehicles();
}

async function editVehicle(id) {
  // select all from the vehicles table that have id equal to the value of the id variable
  // the promise returns matching results if any, and error status to tell us if there was any issues executing this operation
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching vehicles: ", error);
    return;
  }
  document.getElementById("plate").value = data.plate;
  document.getElementById("brand").value = data.brand;
  document.getElementById("model").value = data.model;
  document.getElementById("year").value = data.year;
  document.getElementById("mileage").value = data.mileage;

  document.getElementById("vehicle-form").onsubmit = async (e) => {
    e.preventDefault();
    const updatedVehicle = {
      plate: document.getElementById("plate").value,
      brand: document.getElementById("brand").value,
      model: document.getElementById("model").value,
      year: parseInt(document.getElementById("year").value),
      mileage: parseInt(document.getElementById("mileage").value),
    };
    const { error } = await supabase
      .from("vehicles")
      .update(updatedVehicle)
      .eq("id", id); // get an existing row and update its contents with whats in 'UpdatedVehicle'
    if (error) {
      console.error("Error updating vehicle:", error);
      return;
    }
    document.getElementById("vehicle-form").reset();
    document.getElementById("vehicle-form").onsubmit = null;
    loadVehicles();
  };
}

// for every character entered into search bar, we send a search query to update
// ui with matching database entries if any
document.getElementById("search").addEventListener("input", (e) => {
  loadVehicles(e.target.value);
});

// after the site html is loaded, we load any database data we have to site.
// the onload call back is set to a function that triggers what updates the ui with available data
window.onload = () => loadVehicles();
