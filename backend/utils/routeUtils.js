export const getRouteInfo = async (pickup, drop) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?overview=false`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data?.routes?.length) {
    throw new Error("Unable to calculate route");
  }

  const route = data.routes[0];

  return {
    distanceKm: Number((route.distance / 1000).toFixed(2)),
    durationMin: Math.ceil(route.duration / 60),
  };
};

export const calculateFare = (distanceKm, weightKg) => {
  const baseFare = 100;       // minimum fare
  const perKmRate = 20;       // ₹20 per km
  const weightChargePerKg = 2; // optional weight charge

  const fare = baseFare + distanceKm * perKmRate + weightKg * weightChargePerKg;

  return Math.round(fare);
};