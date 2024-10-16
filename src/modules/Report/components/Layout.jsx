import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import PopulationPyramidChart from "../containers/PopulationPyramidChart";
import EthnicityBarChart from "../containers/EthnicityBarChart";
import InsuranceDonutChart from "../containers/InsuranceDonutChart";
import WaterSource from "../containers/WaterSourceBarChart";
import ToiletTypeBarChart from "../containers/ToiletTypeBarChart";
import DeliveryPlacePieChart from "../containers/DeliveryPlacePieChart";
import PersonnelPieChart from "../containers/PersonnelPieChart";
import MortalityBarChart from "../containers/MortalityBarChart";
import YearSelector from "../containers/YearSelector";
import CloseButton from "../containers/CloseButton";
import DisabilityChart from "../containers/DisabilityChart";
import TotalFamilyRegisteredTable from "../containers/TotalFamilyRegisteredTable";
import ExportPdfButton from "../containers/ExportPdfButton";
import PopulationDetailTable from "../containers/PopulationDetailTable";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TotalPopulationTable from "../containers/TotalPopulationTable";

const useBoxStyle = makeStyles({
  root: {
    height: "100%",
  },
});

function FullHeightBox(props) {
  const boxStyle = useBoxStyle();
  return (
    <Box classes={boxStyle} {...props}>
      {props.children}
    </Box>
  );
}

function Layout({
  data: [data, waterSourceData, toiletTypeData, familyRegisteredData],
  year,
  setYear,
  history,
  selectedOrgUnit,
  reportTitle,
  orgTitle,
  forwardingRefs,
}) {
  const [
    populationTotalTableRef,
    totalPopulationTableRef,
    pyramidPopulationChartRef,
    populationDetailTableRef,
    ethnicityChartRef,
    insuranceChartRef,
    waterSourceChartRef,
    toiletTypeChartRef,
    deliveryChartRef,
    personnelChartRef,
    mortalityChartRef,
    disabilityChartRef,
  ] = forwardingRefs;
  return (
    <Container
      style={{
        height: "calc(100vh - 104px)",
      }}
      maxWidth={false}
    >
      <Grid item xs={12}>
        <Grid container justify="flex-end">
          <FullHeightBox p={1}>
            <CloseButton history={history} />
          </FullHeightBox>
          <ExportPdfButton
            year={year}
            selectedOrgUnit={selectedOrgUnit}
            forwardingRefs={forwardingRefs}
          />
        </Grid>
      </Grid>
      <Grid container justify="center">
        <FullHeightBox textAlign="center">
          <Typography gutterBottom={false} variant="h4" component="h1">
            {reportTitle}
          </Typography>
          <Typography variant="h4" component="h2">
            {orgTitle}
          </Typography>
          <br />
        </FullHeightBox>
      </Grid>
      <Grid spacing={1} container>
        <Grid item xs={12}>
          <FullHeightBox p={2} boxShadow={2}>
            <Grid container justify="flex-start">
              <YearSelector setYear={setYear} year={year} />
            </Grid>
          </FullHeightBox>
        </Grid>
        <Grid item xs={6}>
          <FullHeightBox p={2} boxShadow={2}>
            <TotalFamilyRegisteredTable
              forwardingRef={populationTotalTableRef}
              data={familyRegisteredData}
              year={year}
            />
          </FullHeightBox>
        </Grid>
        <Grid item xs={6}>
          <FullHeightBox p={2} boxShadow={2}>
            <TotalPopulationTable
              forwardingRef={totalPopulationTableRef}
              data={data}
              year={year}
            />
          </FullHeightBox>
        </Grid>
        <Grid item xs={12}>
          <FullHeightBox p={2} boxShadow={2}>
            <Grid container alignItems="center" justify="center">
              <Grid item xs={12} lg={9}>
                <PopulationPyramidChart
                  forwardingRef={pyramidPopulationChartRef}
                  data={data}
                />
              </Grid>
              <Grid item xs={12} lg={3}>
                <PopulationDetailTable
                  forwardingRef={populationDetailTableRef}
                  data={data}
                />
              </Grid>
            </Grid>
          </FullHeightBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <FullHeightBox p={2} boxShadow={2}>
            <EthnicityBarChart forwardingRef={ethnicityChartRef} data={data} />
          </FullHeightBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <FullHeightBox p={2} boxShadow={2}>
            <InsuranceDonutChart
              forwardingRef={insuranceChartRef}
              data={data}
            />
          </FullHeightBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <FullHeightBox p={2} boxShadow={2}>
            <WaterSource
              forwardingRef={waterSourceChartRef}
              data={waterSourceData}
            />
          </FullHeightBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <FullHeightBox p={2} boxShadow={2}>
            <ToiletTypeBarChart
              forwardingRef={toiletTypeChartRef}
              data={toiletTypeData}
            />
          </FullHeightBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <FullHeightBox p={2} boxShadow={2}>
            <DeliveryPlacePieChart
              forwardingRef={deliveryChartRef}
              data={data}
            />
          </FullHeightBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <FullHeightBox p={2} boxShadow={2}>
            <PersonnelPieChart forwardingRef={personnelChartRef} data={data} />
          </FullHeightBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <FullHeightBox p={2} boxShadow={2}>
            <MortalityBarChart forwardingRef={mortalityChartRef} data={data} />
          </FullHeightBox>
        </Grid>

        {year != "2024" ? (
          <Grid item xs={12} md={6}>
            <FullHeightBox p={2} boxShadow={2}>
              <DisabilityChart forwardingRef={disabilityChartRef} data={data} />
            </FullHeightBox>
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
}

export default Layout;
