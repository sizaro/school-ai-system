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
  'scrub-only-5000': { serviceAmount: 5000, salonAmount: 4000,scrubAmount: 4000, scrubAssistantAmount: 1000 },
  'blackshampoo-only-3000': { serviceAmount: 3000, blackShampooAmount: 2000, blackShampooAssistantAmount: 1000 },
  'blackshampoo-only-5000': { serviceAmount: 5000, blackShampooAmount: 4000, blackShampooAssistantAmount: 1000 },
  'superblack-only-8000': { serviceAmount: 8000, salonAmount: 6000, superBlackAssistantAmount: 2000 }
};

const mockEmployees = [
  { id: 1, first_name: "Tagoole", last_name: "Nathan" },
  { id: 2, first_name: "Mukungu", last_name: "Ismail" },
  { id: 3, first_name: "Direse", last_name: "Arafat" },
  { id: 4, first_name: "Nambi", last_name: "Aisha" },
  { id: 5, first_name: "Mutesi", last_name: "Shamina" },
  { id: 6, first_name: "Nantongo", last_name: "Jazimin" },
  { id: 7, first_name: "Nakaibale", last_name: "Sharon" },
  { id: 8, first_name: "Kyewayenda", last_name: "Brenda" },
  { id: 9, first_name: "Tusubira", last_name: "David tobex" },
  { id: 10, first_name: "Kwikiriza", last_name: "Phinnah" },
  { id: 11, first_name: "Muzale Grace", last_name: "innocent" },
  { id: 12, first_name: "Tendo", last_name: "Mirembe" },
  { id: 13, first_name: "Nakato", last_name: "Hilda" },
  { id: 14, first_name: "Bazibu", last_name: "Nickolas" }
];

export default function ServiceForm({ onSubmit, onClose, serviceData }) {
  const [formData, setFormData] = useState({
    service: "",
    barber: "",
    barberAssistant: "",
    scrubberAssistant: "",
    blackMaskAssistant: "",
    blackShampooAssistant: "",
    superBlackAssistant: "",
    service_timestamp:"",
  });

  // Prefill form when editing
  useEffect(() => {
    if (serviceData) {
      setFormData({
        id:serviceData.id,
        service: serviceData.name || "",
        barber: serviceData.barber || "",
        barberAssistant: serviceData.barber_assistant || "",
        scrubberAssistant: serviceData.scrubber_assistant || "",
        blackMaskAssistant: serviceData.black_mask_assistant || "",
        blackShampooAssistant: serviceData.black_shampoo_assistant || "",
        superBlackAssistant: serviceData.super_black_assistant || "",
        service_timestamp: serviceData.service_timestamp
      });
    }
  }, [serviceData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
} = formData;

const calculation = serviceMap[service];
if (!calculation) return alert('Invalid service selected');

const payload = {
  id,
  name: service,

  service_amount: calculation.serviceAmount || 0,
  salon_amount: calculation.salonAmount || 0,

  barber: barber || null,
  barber_amount: calculation.barberAmount || 0,

  barber_assistant: barberAssistant || null,
  barber_assistant_amount: calculation.barberAssistantAmount || 0,

  scrubber_assistant: scrubberAssistant || null,
  scrubber_assistant_amount: calculation.scrubAssistantAmount || 0,

  black_shampoo_assistant: blackShampooAssistant || null,
  black_shampoo_assistant_amount: calculation.blackShampooAssistantAmount || 0,
  black_shampoo_amount: calculation.blackShampooAmount || 0,

  super_black_assistant: superBlackAssistant || null,
  super_black_assistant_amount: calculation.superBlackAssistantAmount || 0,
  super_black_amount: calculation.superBlackAmount || 0,

  black_mask_assistant: blackMaskAssistant || null,
  black_mask_assistant_amount: calculation.blackMaskAssistantAmount || 0,
  black_mask_amount: calculation.blackMaskAmount || 0,
  service_timestamp
};

    onSubmit(payload);
    onClose();
  };

    return (
  <form onSubmit={handleSubmit} className="space-y-4">
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
      </select>
    </div>

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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
          {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
          {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
          {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
            {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
          {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
          {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
          {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
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
          {mockEmployees.map((emp) => (
  <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
    {emp.first_name} {emp.last_name}
  </option>
))}

        </select>
      </div>
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
