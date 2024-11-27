import { db } from "@/lib/db";
import { formatDistance } from "date-fns";

async function getSupportTickets() {
  return await db.contactUs.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function SupportTicketsPage() {
  const tickets = await getSupportTickets();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Support Requests</h1>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No support requests found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Type
                    </span>
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 mt-1">
                      {ticket.subject}
                    </h2>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </span>
                    <p className="text-gray-600 text-sm line-clamp-3 mt-1">{ticket.message}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex flex-col space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Requester Info
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-medium">{ticket.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="truncate">{ticket.email}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Submitted
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {formatDistance(new Date(ticket.createdAt), new Date(), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
