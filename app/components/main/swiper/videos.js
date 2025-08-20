export const videos = [
  {
    id: "711863471",
    title: "OverSized",
    category: "Oversized",
    date: "May 2022",
  },
  {
    id: "478246234",
    title: "T Shirt",
    category: "T Shirt",
    date: "June 2022",
  },
  {
    id: "387407107",
    title: "Jacket",
    category: "Jacket",
    date: "Augest 2022",
  },
  {
    id: "704562417",
    title: "Zodics",
    category: "Zodics Tshirt",
    date: "July 2022",
  },
];

<div
  ref={sliderRef}
  className="absolute top-[5vh] w-full h-full perspective-[175px] perspective-origin-[50%_100%] overflow-hidden"
>
  {videos.map((video) => (
    <div
      key={video.id}
      className="card absolute top-1/2 left-1/2 w-[65%] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-black border-r border-[#303030] rounded-lg flex flex-col overflow-hidden"
    >
      <div className="relative z-10 w-full px-3 py-2 flex items-center bg-black text-[7px]">
        <div className="flex-1">
          <p className="text-gray-400 font-medium">{video.date}</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-gray-400 font-medium">{video.title}</p>
        </div>
        <div className="flex-1 text-right">
          <p className="text-white text-[8px] font-semibold">
            {video.category}
          </p>
        </div>
      </div>
      <div className="relative w-full h-full overflow-hidden">
        <ReactPlayer
          url={`https://player.vimeo.com/video/${video.id}`}
          playing
          loop
          muted
          controls={false}
          width="100%"
          height="100%"
          style={{
            transform: "scale(1.5)",
          }}
        />
      </div>
    </div>
  ))}
</div>;
