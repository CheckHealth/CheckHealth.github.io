/**
 * Created by krbalmryde on 11/8/14.
 */

function extend(ChildClass, ParentClass) {
	ChildClass.prototype = new ParentClass();
	ChildClass.prototype.constructor = ChildClass;
}

extend(WomenChildrenMarker, AbstractMarker);
extend(CommServiceCentersMarker, AbstractMarker);
extend(STIClinicsMarker, AbstractMarker);
extend(NeighborhoodHealthClinicMarker, AbstractMarker);
extend(PCCommHealthClinicMarker, AbstractMarker);