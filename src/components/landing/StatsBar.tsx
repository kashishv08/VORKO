export function StatsBar() {
  const stats = [
    { label: "Projects Completed", value: "10,000+" },
    { label: "Active Freelancers", value: "5,000+" },
    { label: "Happy Clients", value: "3,000+" },
    { label: "Success Rate", value: "98%" },
  ];

  return (
    <section
      className="py-12"
      style={{ backgroundColor: "rgb(34, 197, 94, 0.1)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className="text-3xl md:text-4xl font-bold  mb-2"
                data-testid={`text-stat-value-${index}`}
                style={{ color: "limegreen" }}
              >
                {stat.value}
              </div>
              <div
                className="text-sm text-muted-foreground"
                data-testid={`text-stat-label-${index}`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
