export default function EmailTemplates({ templates = {}, onEdit }) {
  const entries = Object.entries(templates);

  return (
    <section>
      <h4 className="text-lg font-medium text-gray-900 mb-4">Email Templates</h4>
      <ul className="space-y-3">
        {entries.map(([key, template]) => (
          <li
            key={key}
            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
          >
            <div>
              <div className="text-sm font-medium text-gray-900">{key}</div>
              <div className="text-sm text-gray-500">{template.subject}</div>
            </div>
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
