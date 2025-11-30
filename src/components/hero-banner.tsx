export function HeroBanner() {
  return (
    <div className="relative h-64 bg-linear-to-r from-green-400 to-blue-500 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Turf Booking</h1>
        <p className="text-lg">Book your perfect turf experience</p>
      </div>
      {/* Placeholder for image/video */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}