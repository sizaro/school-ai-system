
import { useState, useEffect } from 'react';

const serviceMap = {
  '7000-service': { serviceAmount: 7000, salonAmount: 4000, barberAmount: 2000, barberAssistantAmount: 1000 },
  '6000-service': { serviceAmount: 6000, salonAmount: 3000, barberAmount: 2000, barberAssistantAmount: 1000 },
  '5000-service': { serviceAmount: 5000, salonAmount: 3000, barberAmount: 2000 },
  'child-service': { serviceAmount: 3000, salonAmount: 2000, barberAmount: 1000 },
  'beard-service': { serviceAmount: 3000, salonAmount: 2000, barberAmount: 1000 },
  'haircut-blackmask-12000': { serviceAmount: 12000, salonAmount: 4000, barberAmount: 2000, barberAssistantAmount: 1000, blackMaskAmount: 4000, blackMaskAssistantAmount: 1000 },
  'haircut-blackshampoo-12000': { serviceAmount: 12000, salonAmount: 4000, barberAmount: 2000, barberAssistantAmount: 1000, blackShampooAmount: 3500, blackShampooAssistantAmount: 1500 },
  'haircut-blackshampoo-10000': { serviceAmount: 10000, salonAmount: 4000, barberAmount: 2000, barberAssistantAmount: 1000, blackShampooAmount: 3000, blackShampooAssistantAmount: 1000 },
  'haircut-superblack-15000': { serviceAmount: 15000, salonAmount: 4000, barberAmount: 2000, barberAssistantAmount: 1000, superBlackAmount: 6000, superBlackAssistantAmount: 2000 },
  'trimming-scrub-5000': { serviceAmount: 5000, salonAmount: 3000, barberAmount: 1000, barberAssistantAmount: 1000 },
  'haircut-honey-10000': { serviceAmount: 10000, salonAmount: 6000, barberAmount: 2000, barberAssistantAmount: 2000 },
  'haircut-women': { serviceAmount: 10000, salonAmount: 6000, barberAmount: 4000 },
  'scrub-only-3000': { serviceAmount: 3000, salonAmount: 2000, scrubAmount: 2000, scrubAssistantAmount: 1000 },
  'scrub-only-5000': { serviceAmount: 5000, salonAmount: 4000, scrubAmount: 4000, scrubAssistantAmount: 1000 },
  'blackshampoo-only-3000': { serviceAmount: 3000, blackShampooAmount: 2000, blackShampooAssistantAmount: 1000 },
  'blackshampoo-only-5000': { serviceAmount: 5000, blackShampooAmount: 4000, blackShampooAssistantAmount: 1000 },
  'superblack-only-8000': { serviceAmount: 8000, salonAmount: 6000, superBlackAssistantAmount: 2000 }
};

export default function ServiceForm({ onSubmit, onClose, services, serviceData, Employees, isCustomer = false, createdBy, serviceStatus, customerId=null }) {
  const [formData, setFormData] = useState({
    service: "",
    barber: "",
    barberAssistant: "",
    scrubberAssistant: "",
    blackMaskAssistant: "",
    blackShampooAssistant: "",
    superBlackAssistant: "",
    service_timestamp: "",
    customerNote: "",
    created_by: createdBy,
    status: serviceStatus,
    appointment_time:"",
    appointment_date: "",
    customer_id: customerId,
  });

  console.log("these are the employees in the service form:", Employees)

  console.log("this is the service to be edited in the service form:", serviceData)

  const [serviceAmount, setServiceAmount] = useState(0); // Added for dynamic service amount display
  const [employees, setFilteredEmployees] = useState([]);


  useEffect(() => {
    if (serviceData) {
      setFormData({
        id: serviceData.id,
        service: serviceData.name || "",
        barber: serviceData.barber || null,
        barberAssistant: serviceData.barber_assistant || null,
        scrubberAssistant: serviceData.scrubber_assistant || null,
        blackMaskAssistant: serviceData.black_mask_assistant || null,
        blackShampooAssistant: serviceData.black_shampoo_assistant || null,
        superBlackAssistant: serviceData.super_black_assistant || null,
        service_timestamp: serviceData.service_timestamp,
      });
    }
  }, [serviceData]);

  // Update service amount dynamically
  useEffect(() => {
    const selected = serviceMap[formData.service];
    setServiceAmount(selected ? selected.serviceAmount : 0);
  }, [formData.service]);

  useEffect(() => {
  if (!formData.appointment_date || !formData.appointment_time) {
    setFilteredEmployees(Employees);
    return;
  }

  // Filter out employees who already have CONFIRMED services at the selected date & time
  const unavailableEmployeeIds = services
    ?.filter(
      (service) =>
        service.status === "confirmed" && // ✅ Only confirmed services matter
        service.appointment_date === formData.appointment_date &&
        service.appointment_time === formData.appointment_time
    )
    .flatMap((s) => [
      s.barber_id,
      s.barber_assistant_id,
      s.scrubber_assistant_id,
      s.black_mask_assistant_id,
      s.black_shampoo_assistant_id,
      s.super_black_assistant_id,
    ])
    .filter(Boolean); // remove null or undefined IDs

  const availableEmployees = Employees.filter(
    (emp) => !unavailableEmployeeIds.includes(emp.id)
  );

  setFilteredEmployees(availableEmployees);
}, [formData.appointment_date, formData.appointment_time, serviceData, Employees]);


  const handleChange = (e) => {
  let { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      id,
      service,
      barber,
      barberAssistant,
      scrubberAssistant,
      blackShampooAssistant,
      superBlackAssistant,
      blackMaskAssistant,
      service_timestamp,
      customerNote,
      created_by,
      status,
      appointment_date,
      appointment_time,
      customer_id,

    } = formData;

    let formattedTime = appointment_time; // "09:00 AM"

// Convert to 24-hour format when saving:
if (formattedTime) {
  const [time, modifier] = formattedTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}`;
}

    const calculation = serviceMap[service];
    if (!calculation) return alert('Invalid service selected');

  const toNullableNumber = (val) => {
  if (val === "" || val === " " || val === null || val === undefined) {
    return null;
  }
  return Number(val); // convert valid value to number
};


  const payload = {
  id,
  name: service,
  service_amount: calculation.serviceAmount || 0,
  salon_amount: calculation.salonAmount || 0,
  barber_id: toNullableNumber(barber),
  barber_amount: calculation.barberAmount || 0,
  barber_assistant_id: toNullableNumber(barberAssistant),
  barber_assistant_amount: calculation.barberAssistantAmount || 0,
  scrubber_assistant_id: toNullableNumber(scrubberAssistant),
  scrubber_assistant_amount: calculation.scrubAssistantAmount || 0,
  black_shampoo_assistant_id: toNullableNumber(blackShampooAssistant),
  black_shampoo_assistant_amount: calculation.blackShampooAssistantAmount || 0,
  black_shampoo_amount: calculation.blackShampooAmount || 0,
  super_black_assistant_id: toNullableNumber(superBlackAssistant),
  super_black_assistant_amount: calculation.superBlackAssistantAmount || 0,
  super_black_amount: calculation.superBlackAmount || 0,
  black_mask_assistant_id: toNullableNumber(blackMaskAssistant),
  black_mask_assistant_amount: calculation.blackMaskAssistantAmount || 0,
  black_mask_amount: calculation.blackMaskAmount || 0,
  customer_note: customerNote,
  created_by,
  status,
  appointment_date,
  appointment_time: formattedTime,
  customer_id,
  service_timestamp,
};



    onSubmit(payload);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto h-[80vh]">
      {/* Service selection */}
      <div>
        <label className="block mb-1 font-medium">Choose service</label>
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value=""></option>
          <option value="7000-service">7000 service</option>
          <option value="6000-service">6000 service</option>
          <option value="5000-service">5000 service</option>
          <option value="child-service">Child Service</option>
          <option value="beard-service">Beard Service</option>
          <option value="haircut-blackmask-12000">Haircut + Blackmask (12000)</option>
          <option value="haircut-blackshampoo-12000">Haircut + Blackshampoo (12000)</option>
          <option value="trimming-scrub-5000">Trimming + Scrub (5000)</option>
          <option value="haircut-honey-10000">Haircut + Honey (10000)</option>
          <option value="haircut-women">Haircut Women</option>
          <option value="haircut-blackshampoo-10000">Haircut + Blackshampoo (10000)</option>
          <option value="haircut-superblack-15000">Haircut + SuperBlack (15000)</option>
          <option value="scrub-only-3000">Scrub only (3000)</option>
          <option value="scrub-only-5000">Scrub only (5000)</option>
          <option value="blackshampoo-only-3000">Blackshampoo only (3000)</option>
          <option value="blackshampoo-only-5000">Blackshampoo only (5000)</option>
          <option value="superblack-only-8000">superblack only (8000)</option>
        </select>
      </div>

      {isCustomer && (
  <>
    {/* Appointment Date */}
    <div>
      <label className="block mb-1 font-medium">Appointment Date</label>
      <input
        type="date"
        name="appointment_date"
        value={formData.appointment_date || ""}
        onChange={handleChange
        }
        className="w-full border rounded px-2 py-1"
      />
    </div>

    {/* Appointment Time */}
    <div>
      <label className="block mb-1 font-medium">Appointment Time</label>
      <select
        name="appointment_time"
        value={formData.appointment_time || ""}
        onChange={handleChange}
        className="w-full border rounded px-2 py-1"
      >
        <option value="">Select time</option>
        {[
          "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
          "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
          "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
        ].map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>


  </>
)}

    {/* 7000-service */}
    {formData.service === "7000-service" && (
      <>
        <div>
          <label className="block mb-1">Barber</label>
          <select
            name="barber"
            value={formData.barber}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
        <div>
          <label className="block mb-1">Aesthetician</label>
          <select
            name="barberAssistant"
            value={formData.barberAssistant}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
      </>
    )}

    {/* 6000-service */}
    {formData.service === "6000-service" && (
      <>
        <div>
          <label className="block mb-1">Barber</label>
          <select
            name="barber"
            value={formData.barber}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
        <div>
          <label className="block mb-1">Aesthetician</label>
          <select
            name="barberAssistant"
            value={formData.barberAssistant}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
      </>
    )}


    {/* 5000-service */}
    {formData.service === "5000-service" && (
      <div>
        <label className="block mb-1">Barber</label>
        <select
          name="barber"
          value={formData.barber}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value=""></option>
          {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

        </select>
      </div>
    )}

    {/* child-service */}
    {formData.service === "child-service" && (
      <div>
        <label className="block mb-1">Barber</label>
        <select
          name="barber"
          value={formData.barber}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value=""></option>
          {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

        </select>
      </div>
    )}

    {/* beard-service */}
    {formData.service === "beard-service" && (
      <div>
        <label className="block mb-1">Barber</label>
        <select
          name="barber"
          value={formData.barber}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value=""></option>
          {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

        </select>
      </div>
    )}

    {/* haircut-blackmask-12000 */}
    {formData.service === "haircut-blackmask-12000" && (
      <>
        <div>
          <label className="block mb-1">Barber</label>
          <select
            name="barber"
            value={formData.barber}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
        <div>
          <label className="block mb-1">Aesthetician</label>
          <select
            name="barberAssistant"
            value={formData.barberAssistant}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Black Mask Aesthetician</label>
          <select
            name="blackMaskAssistant"
            value={formData.blackMaskAssistant}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
      </>
    )}


    {/* trimming-scrub-5000 */}
    {formData.service === "trimming-scrub-5000" && (
      <>
        <div>
          <label className="block mb-1">Barber</label>
          <select
            name="barber"
            value={formData.barber}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
        <div>
          <label className="block mb-1">Aesthetician</label>
          <select
            name="barberAssistant"
            value={formData.barberAssistant}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}
          </select>
        </div>
      </>
    )}
  

    {/* haircut-honey-10000 */}
    {formData.service === "haircut-honey-10000" && (
      <>
        <div>
          <label className="block mb-1">Barber</label>
          <select
            name="barber"
            value={formData.barber}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
        <div>
          <label className="block mb-1">Aesthetician</label>
          <select
            name="barberAssistant"
            value={formData.barberAssistant}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}
          </select>
        </div>
      </>
    )}

    {/* haircut-women */}
    {formData.service === "haircut-women" && (
      <>
        <div>
          <label className="block mb-1">Barber</label>
          <select
            name="barber"
            value={formData.barber}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
      </>
    )}


    {/* haircut-blackshampoo-12000 */}
    {formData.service === "haircut-blackshampoo-12000" && (
      <>
        <div>
          <label className="block mb-1">Barber</label>
          <select
            name="barber"
            value={formData.barber}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Aesthetician</label>
          <select
            name="barberAssistant"
            value={formData.barberAssistant}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
        <div>
          <label className="block mb-1">Black Shampoo Aesthetician</label>
          <select
            name="blackShampooAssistant"
            value={formData.blackShampooAssistant}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
      </>
    )}

    {/* haircut-blackshampoo-10000 */}
    {formData.service === "haircut-blackshampoo-10000" && (
      <>
        <div>
          <label className="block mb-1">Barber</label>
          <select
            name="barber"
            value={formData.barber}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
        <div>
          <label className="block mb-1">Aesthetician</label>
          <select
            name="barberAssistant"
            value={formData.barberAssistant}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
        <div>
          <label className="block mb-1">Black Shampoo Aesthetician</label>
          <select
            name="blackShampooAssistant"
            value={formData.blackShampooAssistant}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
      </>
    )}

    {/* haircut-superblack-15000 */}
    {formData.service === "haircut-superblack-15000" && (
      <>
        <div>
          <label className="block mb-1">Barber</label>
          <select
            name="barber"
            value={formData.barber}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
        <div>
          <label className="block mb-1">Aesthetician</label>
          <select
            name="barberAssistant"
            value={formData.barberAssistant}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
        <div>
          <label className="block mb-1">SuperBlack Aesthetician</label>
          <select
            name="superBlackAssistant"
            value={formData.superBlackAssistant}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value=""></option>
            {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

          </select>
        </div>
      </>
    )}

    {/* scrub-only-3000 */}
    {formData.service === "scrub-only-3000" && (
      <div>
        <label className="block mb-1">Scrubber Aesthetician</label>
        <select
          name="scrubberAssistant"
          value={formData.scrubberAssistant}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value=""></option>
          {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

        </select>
      </div>
    )}

    {/* scrub-only-5000 */}
    {formData.service === "scrub-only-5000" && (
      <div>
        <label className="block mb-1">Scrubber Aesthetician</label>
        <select
          name="scrubberAssistant"
          value={formData.scrubberAssistant}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value=""></option>
          {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

        </select>
      </div>
    )}

    {/* blackshampoo-only-3000 */}
    {formData.service === "blackshampoo-only-3000" && (
      <div>
        <label className="block mb-1">Black Shampoo Aesthetician</label>
        <select
          name="blackShampooAssistant"
          value={formData.blackShampooAssistant}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value=""></option>
          {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

        </select>
      </div>
    )}

    {/* blackshampoo-only-5000 */}
    {formData.service === "blackshampoo-only-5000" && (
      <div>
        <label className="block mb-1">Black Shampoo Aesthetician</label>
        <select
          name="blackShampooAssistant"
          value={formData.blackShampooAssistant}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value=""></option>
          {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

        </select>
      </div>
    )}

    
    {/* Super Black Only */}
    {formData.service === "superblack-only-8000" && (
      <div>
        <label className="block mb-1">Super Black Aesthetician</label>
        <select
          name="superBlackAssistant"
          value={formData.superBlackAssistant}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value=""></option>
          {employees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.first_name} {emp.last_name}
  </option>
))}

        </select>
      </div>
      )}

      {isCustomer && (
        <>
          <p className="text-sm text-gray-700 bg-yellow-100 p-2 rounded">
            Note: Your appointment will only remain valid for <b>10 minutes</b> after the scheduled time.
            After that, the employee may attend to another client, and you may have to wait.
          </p>

          {formData.service && (
            <p className="text-gray-700 font-medium">
              The total amount for this service is <span className="text-green-700">UGX {serviceAmount}</span>
            </p>
          )}

          <div>
            <label className="block mb-1 font-medium">Additional Information</label>
            <textarea
              name="customerNote"
              value={formData.customerNote}
              onChange={handleChange}
              placeholder="Any special requests or details..."
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </>
      )}

      <button
        className="mt-4 bg-blue-400 hover:bg-blue-600 text-white py-2 px-4 rounded"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}
