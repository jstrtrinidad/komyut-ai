function TeamSection() {
  const team = [
  {
    name: "Trinidad",
    role: "Front End Developer",
    image: "/team/jester.png",
  },

  {
    name: "Villanueva",
    role: "Front End Developer",
    image: "/team/lewis.jpg",
  },

  {
    name: "Gecarane",
    role: "API Backend Developer",
    image: "/team/jm.jpeg",
  },

  {
    name: "Gonzales",
    role: "AI Backend Developer",
    image: "/team/noel.jpg",
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
              <img
                src={member.image}
                alt={member.name}
                className="mx-auto h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg"
              />

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