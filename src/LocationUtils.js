function distance(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }
  let p = 0.017453292519943295; // Math.PI / 180
  let c = Math.cos;
  let a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function distanceByLoc(locA, locB) {
  if (locA[0] === locB[0] && locA[1] === locB[1]) {
    return 0;
  }
  let p = 0.017453292519943295; // Math.PI / 180
  let c = Math.cos;
  let a =
    0.5 -
    c((locB[0] - locA[0]) * p) / 2 +
    (c(locA[0] * p) * c(locB[0] * p) * (1 - c((locB[1] - locA[1]) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

module.exports = {
  distance: distance,
  distanceByLoc: distanceByLoc
};
