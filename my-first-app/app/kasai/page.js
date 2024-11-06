import React from 'react';

const data = [
  { model: 'Model A', tasks: 60, latency: '10ms', throughput: '100/sec', accuracy: '95%' },
  { model: 'Model B', tasks: 75, latency: '12ms', throughput: '120/sec', accuracy: '92%' },
  { model: 'Model C', tasks: 90, latency: '15ms', throughput: '90/sec', accuracy: '98%' },
];

const BenchmarkTable = () => {
  return (
    <div className="relative w-full overflow-hidden my-12"> {/* Container */}
      <div className="hidden lg:block absolute top-0 left-0 text-gray-900 font-bold text-xl">Benchmark Results</div> {/* Title (Desktop only) */}

      <div className="overflow-x-auto"> {/* For horizontal scrolling if needed */}
        <table className="w-full table-auto text-left"> {/* Table */}
          <thead className="text-gray-900 font-medium border-b border-gray-200"> {/* Table Head */}
            <tr>
              {['Model', 'Tasks', 'Latency', 'Throughput', 'Accuracy'].map(header => (
                <th key={header} className="py-4 px-6">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-500"> {/* Table Body */}
            {data.map((row, index) => (
              <tr key={index} className={index % 2 === 1 ? 'bg-gray-50' : ''}> {/* Alternating row colors */}
                <td className="py-4 px-6 font-medium text-gray-900">{row.model}</td> {/* Model - darker text */}
                <td className="py-4 px-6">{row.tasks}</td>
                <td className="py-4 px-6">{row.latency}</td>
                <td className="py-4 px-6">{row.throughput}</td>
                <td className="py-4 px-6">{row.accuracy}</td>
              </tr>
            ))}

            {/* Example of a full-width row: */}
            <tr>
              <td colSpan={5} className="py-4 px-6 bg-blue-100 border border-blue-200 rounded-lg text-blue-700 font-medium text-center">{/* Full-width row with background */}
                 This is an example of a full-width row. You can add any content here.
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">{/* Caption */}
        * This is a caption for the table.
      </div>
    </div>
  );
};

export default BenchmarkTable;
