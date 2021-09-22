import coreUtils from "@opentripplanner/core-utils";
import { humanizeDistanceString } from "@opentripplanner/humanize-distance";
import PropTypes from "prop-types";
import React from "react";
import { AccessibilityRating } from "../../itinerary-body/lib/ItineraryBody";

import * as S from "./styled";

export default function AccessLeg({
  accessibilityScoreGradationMap,
  config,
  leg,
  LegIcon
}) {
  return (
    <S.Leg>
      <S.LegAnnotation>
        <S.ModeIcon>
          <LegIcon leg={leg} />
        </S.ModeIcon>
        {leg.accessibilityScore && (
          <AccessibilityRating
            gradationMap={accessibilityScoreGradationMap}
            score={leg.accessibilityScore}
          />
        )}
      </S.LegAnnotation>
      <S.LegBody>
        <S.LegHeader>
          <b>{coreUtils.itinerary.getLegModeLabel(leg)}</b>{" "}
          {leg.distance > 0 && (
            <span> {humanizeDistanceString(leg.distance)}</span>
          )}
          {" to "}
          <b>{coreUtils.itinerary.getPlaceName(leg.to, config.companies)}</b>
        </S.LegHeader>
        {!leg.hailedCar && (
          <S.LegDetails>
            {leg.steps.map((step, k) => {
              return (
                <S.LegDetail key={k}>
                  {coreUtils.itinerary.getStepDirection(step)} on{" "}
                  <b>{coreUtils.itinerary.getStepStreetName(step)}</b>
                </S.LegDetail>
              );
            })}
          </S.LegDetails>
        )}
      </S.LegBody>
    </S.Leg>
  );
}

AccessLeg.propTypes = {
  accessibilityScoreGradationMap: PropTypes.shape({
    color: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.element
  }),
  config: coreUtils.types.configType.isRequired,
  leg: coreUtils.types.legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired
};

AccessLeg.defaultProps = {
  accessibilityScoreGradationMap: null
};
