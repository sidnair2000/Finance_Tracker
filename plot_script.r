library(tidyverse)
library(DBI)
library(RPostgres)


db_host <- "localhost"
db_port <- 5432
db_name <- "finances"
db_user <- "postgres"
db_password <- "Isthisgoodenough!"

con <- NULL

tryCatch({
  con <- dbConnect(RPostgres::Postgres(),
                   dbname = db_name,
                   host = db_host,
                   port = db_port,
                   user = db_user,
                   password = db_password)

  # If connection is successful, print success message
  cat("Connected to the database successfully!\n")

  # Optionally, you can run a simple query to test
  test_query <- "SELECT * from expenses"  # This query returns the current timestamp
  result <- dbGetQuery(con, test_query)
  print(result)
  
}, error = function(e) {
  # Print error message if the connection fails
  cat("Failed to connect to the database:\n", e$message, "\n")
})

# Disconnect from the database if connected
if (!is.null(con)) {
  dbDisconnect(con)
}

plot <- result %>%
  ggplot(aes(x = month, y = cost)) +
  geom_point(color = "blue") +
  geom_smooth(method = "lm", color = "red", se = FALSE) +
  labs(title = "Monthwise Expenses",
       x = "Month",
       y = "Expenses") +
  theme_minimal()




args <- commandArgs(trailingOnly = TRUE)
output_file <- ifelse(length(args) > 0, args[1], "plot.png")

# # Use the 'cars' dataset and create a scatter plot with ggplot2
# plot <- cars %>%
#   ggplot(aes(x = speed, y = dist)) +
#   geom_point(color = "blue") +
#   geom_smooth(method = "lm", color = "red", se = FALSE) +
#   labs(title = "Speed vs Stopping Distance",
#        x = "Speed (mph)",
#        y = "Stopping Distance (ft)") +
#   theme_minimal()

# Save the plot as a PNG image
ggsave(output_file, plot = plot, width = 6, height = 4, dpi = 300)


