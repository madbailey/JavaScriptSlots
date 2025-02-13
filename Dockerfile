# Use lightweight nginx image
FROM nginx:alpine

# Copy the static files to nginx directory
COPY . /usr/share/nginx/html/

# Copy custom nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80