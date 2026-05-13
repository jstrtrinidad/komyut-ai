function TeamSection() {
  const team = [
    {
      name: "Trinidad",
      role: "UI/UX & Project Lead",
    },

    {
      name: "Villanueva",
      role: "Frontend Developer",
    },

    {
      name: "Gecarane",
      role: "Backend Developer",
    },

    {
      name: "Gonzales",
      role: "AI & CRUD Integration",
    },
  ];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-5xl font-black text-black">
            Meet the Team
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#5f6368]">
            The people building smarter commuting experiences for Metro
            Manila.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <div
              key={index}
              className="rounded-[32px] border border-[#ece7dc] bg-[#f8f6f1] p-10 text-center transition hover:-translate-y-1"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f4b400] text-3xl font-black text-black">
                {member.name.charAt(0)}
              </div>

              <h3 className="mt-8 text-2xl font-black text-black">
                {member.name}
              </h3>

              <p className="mt-3 text-[#5f6368]">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;