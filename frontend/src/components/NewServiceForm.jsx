import { useState, useEffect } from "react";
import Button from "./Button";

export default function NewServiceForm({ onSubmit, onClose, Sections, serviceData = null }) {
  const [formData, setFormData] = useState({
    service_name: "",
    service_amount: "",
    salon_amount: "",
    section_id: "",
    description: "",
    service_image: null,
    roles: [{ role_name: "", role_amount: "" }],
    materials: [{ material_name: "", material_cost: "" }],
  });

  // Populate formData when editing
  useEffect(() => {
    if (serviceData) {
      setFormData({
        service_name: serviceData.service_name || "",
        service_amount: serviceData.service_amount || "",
        salon_amount: serviceData.salon_amount || "",
        section_id: serviceData.section_id || "",
        description: serviceData.description || "",
        service_image: null, // can't prefill file input
        roles: serviceData.roles?.length
          ? serviceData.roles.map((r) => ({
              role_name: r.role_name || "",
              role_amount: r.role_amount || "",
            }))
          : [{ role_name: "", role_amount: "" }],
        materials: serviceData.materials?.length
          ? serviceData.materials.map((m) => ({
              material_name: m.material_name || "",
              material_cost: m.material_cost || "",
            }))
          : [{ material_name: "", material_cost: "" }],
      });
    }
  }, [serviceData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (index, field, value) => {
    const newRoles = [...formData.roles];
    newRoles[index][field] = value;
    setFormData((prev) => ({ ...prev, roles: newRoles }));
  };

  const handleMaterialChange = (index, field, value) => {
    const newMaterials = [...formData.materials];
    newMaterials[index][field] = value;
    setFormData((prev) => ({ ...prev, materials: newMaterials }));
  };

  const addRole = () => setFormData(prev => ({ ...prev, roles: [...prev.roles, { role_name: "", role_amount: "" }] }));
  const removeRole = (index) => setFormData(prev => ({ ...prev, roles: prev.roles.filter((_, i) => i !== index) }));
  const addMaterial = () => setFormData(prev => ({ ...prev, materials: [...prev.materials, { material_name: "", material_cost: "" }] }));
  const removeMaterial = (index) => setFormData(prev => ({ ...prev, materials: prev.materials.filter((_, i) => i !== index) }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.service_name.trim()) return alert("Service name is required");
    if (!formData.section_id) return alert("Please select a section");
    if (!formData.service_amount.trim()) return alert("Service full amount is required");
    if (!formData.salon_amount.trim()) return alert("Salon amount is required");
    if (!formData.description.trim()) return alert("Service description is required");

    const validRoles = formData.roles.filter(r => r.role_name.trim() && r.role_amount.trim());
    const validMaterials = formData.materials.filter(m => m.material_name.trim() && m.material_cost.trim());

    const data = new FormData();
    data.append("service_name", formData.service_name);
    data.append("service_amount", Number(formData.service_amount));
    data.append("salon_amount", Number(formData.salon_amount));
    data.append("section_id", formData.section_id);
    data.append("description", formData.description);
    if (formData.service_image) data.append("service_image", formData.service_image);

    validRoles.forEach((r, i) => {
      data.append(`roles[${i}][role_name]`, r.role_name);
      data.append(`roles[${i}][role_amount]`, Number(r.role_amount));
    });

    validMaterials.forEach((m, i) => {
      data.append(`materials[${i}][material_name]`, m.material_name);
      data.append(`materials[${i}][material_cost]`, Number(m.material_cost));
    });

    onSubmit(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 overflow-y-auto h-[80vh]">
      <h2 className="text-xl font-semibold mb-4">{serviceData ? "Edit Service" : "Add New Service"}</h2>

      {/* SECTION */}
      <label className="block font-medium">
        Section:
        <select className="border rounded w-full p-2 mt-1" value={formData.section_id} onChange={(e) => handleChange("section_id", e.target.value)}>
          <option value="">Select a section</option>
          {Sections?.map(sec => <option key={sec.id} value={sec.id}>{sec.section_name}</option>)}
        </select>
      </label>

      {/* SERVICE NAME */}
      <label className="block font-medium">
        Service Name:
        <input type="text" className="border rounded w-full p-2 mt-1" value={formData.service_name} onChange={(e) => handleChange("service_name", e.target.value)} />
      </label>

      {/* SERVICE AMOUNT */}
      <label className="block font-medium">
        Service Full Amount:
        <input type="text" className="border rounded w-full p-2 mt-1" value={formData.service_amount} onChange={(e) => handleChange("service_amount", e.target.value.replace(/[^\d.]/g, ""))} />
      </label>

      {/* SALON AMOUNT */}
      <label className="block font-medium">
        Salon Amount:
        <input type="text" className="border rounded w-full p-2 mt-1 bg-yellow-100" value={formData.salon_amount} onChange={(e) => handleChange("salon_amount", e.target.value.replace(/[^\d.]/g, ""))} />
      </label>

      {/* DESCRIPTION */}
      <label className="block font-medium">
        Service Description:
        <textarea className="border rounded w-full p-2 mt-1" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
      </label>

      {/* IMAGE UPLOAD */}
      <label className="block font-medium">
        Service Image:
        <input type="file" accept="image/*" className="mt-1 block w-full border-gray-300 rounded-md p-2" onChange={(e) => handleChange("service_image", e.target.files[0])} />
      </label>

      {/* ROLES */}
      <h3 className="text-lg font-semibold mt-4">Employee Roles</h3>
      {formData.roles.map((role, index) => (
        <div key={index} className="border p-3 rounded-lg bg-gray-100 shadow-sm space-y-2">
          <label className="block font-medium">
            Role Name:
            <input type="text" className="border rounded w-full p-2 mt-1" value={role.role_name} onChange={(e) => handleRoleChange(index, "role_name", e.target.value)} />
          </label>

          <label className="block font-medium">
            Role Amount:
            <input type="text" className="border rounded w-full p-2 mt-1" value={role.role_amount} onChange={(e) => handleRoleChange(index, "role_amount", e.target.value.replace(/[^\d.]/g, ""))} />
          </label>

          {index > 0 && <Button type="button" className="bg-red-600 text-white" onClick={() => removeRole(index)}>Remove Role</Button>}
        </div>
      ))}
      <Button type="button" className="bg-yellow-500 text-black" onClick={addRole}>+ Add Role</Button>

      {/* MATERIALS */}
      <h3 className="text-lg font-semibold mt-6">Service Materials</h3>
      {formData.materials.map((mat, index) => (
        <div key={index} className="border p-3 rounded-lg bg-blue-100 shadow-sm space-y-2">
          <label className="block font-medium">
            Material Name:
            <input type="text" className="border rounded w-full p-2 mt-1" value={mat.material_name} onChange={(e) => handleMaterialChange(index, "material_name", e.target.value)} />
          </label>

          <label className="block font-medium">
            Material Cost:
            <input type="text" className="border rounded w-full p-2 mt-1" value={mat.material_cost} onChange={(e) => handleMaterialChange(index, "material_cost", e.target.value.replace(/[^\d.]/g, ""))} />
          </label>

          {index > 0 && <Button type="button" className="bg-red-600 text-white" onClick={() => removeMaterial(index)}>Remove Material</Button>}
        </div>
      ))}
      <Button type="button" className="bg-green-500 text-black" onClick={addMaterial}>+ Add Material</Button>

      {/* SUBMIT */}
      <div className="flex gap-3 mt-5">
        <Button type="submit">{serviceData ? "Update Service" : "Create Service"}</Button>
        <Button type="button" className="bg-gray-400" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}
