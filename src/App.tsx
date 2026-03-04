import { useMemo, useState } from 'react'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined'
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined'
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'
import type { PaletteMode } from '@mui/material'
import { createAppTheme } from './theme'

type HeatingPoint = {
  day: string
  consumption: number
  target: number
}

type TemperaturePoint = {
  time: string
  temperature: number
  heater: 0 | 1
}

// условные демо‑данные за 30 дней
const heatingData: HeatingPoint[] = [
  { day: '1', consumption: 34, target: 35 },
  { day: '2', consumption: 33.5, target: 35 },
  { day: '3', consumption: 33, target: 35 },
  { day: '4', consumption: 32.5, target: 35 },
  { day: '5', consumption: 32, target: 35 },
  { day: '6', consumption: 31.5, target: 35 },
  { day: '7', consumption: 31, target: 35 },
  { day: '8', consumption: 30.5, target: 34 },
  { day: '9', consumption: 30, target: 34 },
  { day: '10', consumption: 29.8, target: 34 },
  { day: '11', consumption: 29.5, target: 34 },
  { day: '12', consumption: 29.2, target: 34 },
  { day: '13', consumption: 29, target: 34 },
  { day: '14', consumption: 28.7, target: 34 },
  { day: '15', consumption: 28.4, target: 33 },
  { day: '16', consumption: 28.1, target: 33 },
  { day: '17', consumption: 27.9, target: 33 },
  { day: '18', consumption: 27.6, target: 33 },
  { day: '19', consumption: 27.3, target: 33 },
  { day: '20', consumption: 27, target: 33 },
  { day: '21', consumption: 26.8, target: 32 },
  { day: '22', consumption: 26.5, target: 32 },
  { day: '23', consumption: 26.2, target: 32 },
  { day: '24', consumption: 26, target: 32 },
  { day: '25', consumption: 25.7, target: 32 },
  { day: '26', consumption: 25.4, target: 32 },
  { day: '27', consumption: 25.2, target: 31 },
  { day: '28', consumption: 25, target: 31 },
  { day: '29', consumption: 24.8, target: 31 },
  { day: '30', consumption: 24.5, target: 31 },
]

const temperatureData: TemperaturePoint[] = [
  { time: '1', temperature: 21.2, heater: 1 },
  { time: '2', temperature: 21.3, heater: 1 },
  { time: '3', temperature: 21.1, heater: 1 },
  { time: '4', temperature: 21.0, heater: 1 },
  { time: '5', temperature: 20.9, heater: 0 },
  { time: '6', temperature: 20.8, heater: 0 },
  { time: '7', temperature: 20.7, heater: 0 },
  { time: '8', temperature: 21.0, heater: 1 },
  { time: '9', temperature: 21.2, heater: 1 },
  { time: '10', temperature: 21.4, heater: 1 },
  { time: '11', temperature: 21.3, heater: 0 },
  { time: '12', temperature: 21.1, heater: 0 },
  { time: '13', temperature: 21.0, heater: 0 },
  { time: '14', temperature: 20.9, heater: 0 },
  { time: '15', temperature: 21.1, heater: 1 },
  { time: '16', temperature: 21.3, heater: 1 },
  { time: '17', temperature: 21.5, heater: 1 },
  { time: '18', temperature: 21.4, heater: 1 },
  { time: '19', temperature: 21.2, heater: 0 },
  { time: '20', temperature: 21.0, heater: 0 },
  { time: '21', temperature: 20.9, heater: 0 },
  { time: '22', temperature: 21.0, heater: 0 },
  { time: '23', temperature: 21.1, heater: 1 },
  { time: '24', temperature: 21.2, heater: 1 },
  { time: '25', temperature: 21.3, heater: 1 },
  { time: '26', temperature: 21.2, heater: 1 },
  { time: '27', temperature: 21.0, heater: 0 },
  { time: '28', temperature: 20.9, heater: 0 },
  { time: '29', temperature: 20.8, heater: 0 },
  { time: '30', temperature: 20.7, heater: 0 },
]

const comfortLevel = 78
const economyThisMonth = 18
const forecastSaving = 22

type Language = 'ru' | 'en'
type Range = 'day' | 'week' | 'month'

const texts: Record<Language, Record<string, string>> = {
  ru: {
    appSubtitle: 'Smart Home',
    appTitle: 'Профиль',
    heatingStatus: 'Отопление оптимально',
    role: 'Владелец дома',
    profileLabel: 'Профиль',
    homeSubtitle: 'Умный дом · Коттедж, 180 м²',
    efficiencyLabel: 'Энергоэффективность отопления',
    efficiencyHint: 'Система учитывает погоду и привычки.',
    savingThisMonth: 'Экономия в этом месяце',
    savingVsYear: 'к прошлому году',
    forecastSavingLabel: 'Прогноз экономии',
    forecastHint: 'до конца сезона',
    heatingEnergyTitle: 'Отопление · Энергопотребление',
    last7Days: 'Последние 7 дней',
    tariffHint: 'Учитывается погода и ночной тариф',
    avgDaily: 'Среднее за день',
    nightUse: 'Ночью',
    potentialSaving: 'Потенциал',
    temperatureChartTitle: 'Температура дома',
    temperatureLegend: 'Температура',
    heaterLegend: 'Отопление',
    heatingOnLabel: 'вкл',
    heatingOffLabel: 'выкл',
    scenariosTitle: 'Сценарии отопления',
    scenarioComfort: 'Комфортный вечер',
    scenarioNight: 'Ночной эко',
    scenarioAway: 'Отпуск',
    quickOverviewTitle: 'Краткий обзор',
    quickLine1: 'Сегодня расход ниже среднего по району.',
    quickLine2: 'Дом выходит на комфорт за 20–25 минут.',
    quickLine3: 'Похолодание уже учтено в расписании.',
    menuOverview: 'Обзор',
    menuHeating: 'Отопление',
    menuDevices: 'Устройства',
    menuSettings: 'Настройки',
  },
  en: {
    appSubtitle: 'Smart Home',
    appTitle: 'Profile',
    heatingStatus: 'Heating is optimal',
    role: 'Home owner',
    profileLabel: 'Profile',
    homeSubtitle: 'Smart home · House, 180 m²',
    efficiencyLabel: 'Heating efficiency',
    efficiencyHint: 'System adapts to weather and habits.',
    savingThisMonth: 'Saving this month',
    savingVsYear: 'vs last year',
    forecastSavingLabel: 'Forecast saving',
    forecastHint: 'by end of season',
    heatingEnergyTitle: 'Heating · Energy',
    last7Days: 'Last 7 days',
    tariffHint: 'Weather and night tariff included',
    avgDaily: 'Daily average',
    nightUse: 'Night',
    potentialSaving: 'Potential',
    temperatureChartTitle: 'Home temperature',
    temperatureLegend: 'Temperature',
    heaterLegend: 'Heating',
    heatingOnLabel: 'on',
    heatingOffLabel: 'off',
    scenariosTitle: 'Heating scenarios',
    scenarioComfort: 'Cozy evening',
    scenarioNight: 'Night eco',
    scenarioAway: 'Away',
    quickOverviewTitle: 'Quick overview',
    quickLine1: 'Today usage is below area average.',
    quickLine2: 'Home reaches comfort in ~20–25 min.',
    quickLine3: 'Cold snap is already scheduled.',
    menuOverview: 'Overview',
    menuHeating: 'Heating',
    menuDevices: 'Devices',
    menuSettings: 'Settings',
  },
}

const App = () => {
  const [mode, setMode] = useState<PaletteMode>('dark')
  const [language, setLanguage] = useState<Language>('ru')
  const [range, setRange] = useState<Range>('week')
  const theme = useMemo(() => createAppTheme(mode), [mode])
  const t = texts[language]

  const visibleHeatingData = useMemo(() => {
    const count = range === 'day' ? 1 : range === 'week' ? 7 : 30
    return heatingData.slice(-count)
  }, [range])

  const visibleTemperatureData = useMemo(() => {
    const count = range === 'day' ? 1 : range === 'week' ? 7 : 30
    return temperatureData.slice(-count)
  }, [range])

  const toggleMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ru' ? 'en' : 'ru'))
  }

  const handleRangeChange = (_: React.MouseEvent<HTMLElement>, value: Range | null) => {
    if (value) setRange(value)
  }

  const periodLabel =
    language === 'ru'
      ? range === 'day'
        ? 'Последний день'
        : range === 'week'
          ? 'Последние 7 дней'
          : 'Последние 30 дней'
      : range === 'day'
        ? 'Last day'
        : range === 'week'
          ? 'Last 7 days'
          : 'Last 30 days'

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          color="default"
          sx={{
            borderBottom: '1px solid rgba(148,163,184,0.16)',
            bgcolor: 'transparent',
            backdropFilter: 'blur(18px)',
          }}
        >
          <Toolbar disableGutters>
            <Container
              maxWidth="xl"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                px: { xs: 2, md: 3 },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(56,189,248,0.15)',
                  }}
                >
                  <HomeOutlinedIcon fontSize="small" color="secondary" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 11, color: 'text.secondary' }}>
                    {t.appSubtitle}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t.appTitle}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Chip
                  color="success"
                  variant="outlined"
                  size="small"
                  label={t.heatingStatus}
                  icon={<TrendingDownOutlinedIcon fontSize="small" />}
                  sx={{ borderRadius: 999, display: { xs: 'none', sm: 'inline-flex' } }}
                />
                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(148,163,184,0.4)', display: { xs: 'none', sm: 'block' } }} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton size="small" color="inherit">
                    <ElectricBoltOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="inherit">
                    <Badge color="error" variant="dot">
                      <NotificationsNoneOutlinedIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                  <IconButton size="small" color="inherit">
                    <SettingsOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="inherit" onClick={toggleMode}>
                    {mode === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
                  </IconButton>
                  <Chip
                    size="small"
                    variant="outlined"
                    icon={<LanguageOutlinedIcon fontSize="small" />}
                    label={language.toUpperCase()}
                    onClick={toggleLanguage}
                    sx={{ borderRadius: 999 }}
                  />
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Alex
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t.role}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: 'primary.main',
                        boxShadow: '0 0 0 2px rgba(15,23,42,0.9)',
                      }}
                    >
                      A
                    </Avatar>
                  </Stack>
                </Stack>
              </Stack>
            </Container>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            flex: 1,
            py: 3,
            px: { xs: 2, md: 3 },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ maxWidth: 1440, width: '100%' }}>
            <Stack direction="row" spacing={1.5} mb={2} sx={{ overflowX: 'auto' }}>
              <Chip label={t.menuOverview} color="primary" variant="filled" />
              <Chip label={t.menuHeating} variant="outlined" />
              <Chip label={t.menuDevices} variant="outlined" />
              <Chip label={t.menuSettings} variant="outlined" />
            </Stack>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                }}
              >
                <Typography variant="overline" sx={{ letterSpacing: 1.4, color: 'text.secondary' }}>
                  {t.profileLabel}
                </Typography>
                <Stack direction="row" spacing={2.5} alignItems="center">
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: 'secondary.main',
                    }}
                  >
                    A
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Alex Rajvandary
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.homeSubtitle}
                    </Typography>
                  </Box>
                </Stack>

                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      {t.efficiencyLabel}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {comfortLevel}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={comfortLevel}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      backgroundColor: 'rgba(30,64,175,0.65)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 999,
                        background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {t.efficiencyHint}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(148,163,184,0.4)' }} />

                <Stack direction="row" spacing={2}>
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      {t.savingThisMonth}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <TrendingDownOutlinedIcon color="success" fontSize="small" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {economyThisMonth}%
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {t.savingVsYear}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      {t.forecastSavingLabel}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <ElectricBoltOutlinedIcon color="secondary" fontSize="small" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {forecastSaving}%
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {t.forecastHint}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 9 }}>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1.5 }}
              >
                <ToggleButtonGroup
                  value={range}
                  exclusive
                  size="small"
                  onChange={handleRangeChange}
                  sx={{
                    '& .MuiToggleButton-root': { textTransform: 'none', px: 1.5 },
                  }}
                >
                  <ToggleButton value="day">{language === 'ru' ? 'День' : 'Day'}</ToggleButton>
                  <ToggleButton value="week">{language === 'ru' ? 'Неделя' : 'Week'}</ToggleButton>
                  <ToggleButton value="month">{language === 'ru' ? 'Месяц' : 'Month'}</ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                      <Box>
                        <Typography variant="overline" sx={{ letterSpacing: 1.4, color: 'text.secondary' }}>
                          {t.heatingEnergyTitle}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {periodLabel}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        variant="outlined"
                        icon={<OpacityOutlinedIcon fontSize="small" />}
                        label={t.tariffHint}
                        sx={{ borderRadius: 999, maxWidth: 200 }}
                      />
                    </Stack>

                    <Box sx={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={visibleHeatingData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                          <XAxis dataKey="day" stroke="rgba(148,163,184,0.9)" />
                          <YAxis
                            stroke="rgba(148,163,184,0.9)"
                            width={50}
                            tickFormatter={(v) => `${v} кВт·ч`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              borderRadius: 12,
                              border: '1px solid rgba(148,163,184,0.4)',
                            }}
                            formatter={(value: number | undefined, name: string) => {
                              const v = value ?? 0
                              return name === 'consumption'
                                ? [`${v} кВт·ч`, 'Факт']
                                : [`${v} кВт·ч`, 'Цель']
                            }}
                          />
                          <Legend formatter={(value) => (value === 'consumption' ? 'Факт' : 'Цель')} />
                          <ReferenceLine
                            y={35}
                            stroke="rgba(148,163,184,0.6)"
                            strokeDasharray="4 4"
                          />
                          <Line
                            type="monotone"
                            dataKey="target"
                            stroke="rgba(148,163,184,0.8)"
                            strokeWidth={1.5}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="consumption"
                            stroke={theme.palette.primary.main}
                            strokeWidth={2.4}
                            dot={{ r: 4, fill: theme.palette.primary.main, strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} mt={3}>
                      <Box flex={1}>
                        <Typography variant="caption" color="text.secondary">
                          {t.avgDaily}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          27,3 кВт·ч
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          −12%
                        </Typography>
                      </Box>
                      <Box flex={1}>
                        <Typography variant="caption" color="text.secondary">
                          {t.nightUse}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          9,1 кВт·ч
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          +
                        </Typography>
                      </Box>
                      <Box flex={1}>
                        <Typography variant="caption" color="text.secondary">
                          {t.potentialSaving}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          до 11%
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                    }}
                  >
                    <Typography variant="overline" sx={{ letterSpacing: 1.4, color: 'text.secondary' }}>
                      {t.temperatureChartTitle}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                      {periodLabel}
                    </Typography>
                    <Box sx={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={visibleTemperatureData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                          <XAxis dataKey="time" stroke="rgba(148,163,184,0.9)" />
                          <YAxis
                            yAxisId="left"
                            stroke="rgba(148,163,184,0.9)"
                            width={50}
                            tickFormatter={(v) => `${v}°C`}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            width={40}
                            domain={[0, 1]}
                            ticks={[0, 1]}
                            tickFormatter={(v) => (v === 1 ? t.heatingOnLabel : t.heatingOffLabel)}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              borderRadius: 12,
                              border: '1px solid rgba(148,163,184,0.4)',
                            }}
                            formatter={(value: number | undefined, name: string) => {
                              const v = value ?? 0
                              return name === 'temperature'
                                ? [`${v}°C`, t.temperatureLegend]
                                : [v === 1 ? t.heatingOnLabel : t.heatingOffLabel, t.heaterLegend]
                            }}
                          />
                          <Legend
                            formatter={(value) =>
                              value === 'temperature' ? t.temperatureLegend : t.heaterLegend
                            }
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="temperature"
                            stroke={theme.palette.secondary.main}
                            strokeWidth={2.2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                          <Line
                            yAxisId="right"
                            type="stepAfter"
                            dataKey="heater"
                            stroke={theme.palette.primary.main}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              <Paper
                sx={{
                  p: 3,
                }}
              >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Box flex={1}>
                    <Typography variant="overline" sx={{ letterSpacing: 1.4, color: 'text.secondary' }}>
                      {t.scenariosTitle}
                    </Typography>
                    <List dense>
                      <ListItem disableGutters sx={{ mb: 1 }}>
                        <ListItemText
                          primary={
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {t.scenarioComfort}
                              </Typography>
                              <Chip size="small" color="success" label="On" />
                            </Stack>
                          }
                        />
                      </ListItem>
                      <ListItem disableGutters sx={{ mb: 1 }}>
                        <ListItemText
                          primary={
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {t.scenarioNight}
                              </Typography>
                              <Chip size="small" variant="outlined" label="Eco" />
                            </Stack>
                          }
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {t.scenarioAway}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>
                  </Box>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: 'none', md: 'block' }, borderColor: 'rgba(148,163,184,0.4)' }}
                  />

                  <Box flex={1}>
                    <Typography variant="overline" sx={{ letterSpacing: 1.4, color: 'text.secondary' }}>
                      {t.quickOverviewTitle}
                    </Typography>
                    <Stack spacing={1} mt={1}>
                      <Typography variant="body2">{t.quickLine1}</Typography>
                      <Typography variant="body2">{t.quickLine2}</Typography>
                      <Typography variant="body2">{t.quickLine3}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App

