import React from 'react';
import { storyblokEditable } from '@storyblok/react';
import RichTextEditor from '@/src/components/storyblok/RichTextEditor';

const Footer = ({ blok }) => {
    const {
        background,
        logo,
        name,
        description,
        columns = [],
        newsletter_placeholder,
        social_links = [],
    } = blok;

    const limitedColumns = columns.slice(0, 5); // Limit to 5 columns

    return (
        <footer {...storyblokEditable(blok)} className="footer">
            <div className="content-layer">
                {/* Brand Section */}
                <div className="brand-section">
                    <div className="logo">
                        <img
                            src={logo?.filename}
                            alt={name || 'Logo'}
                            className="logo-image"
                        />
                    </div>
                    {description && <RichTextEditor blok={{ content: description, textColor: '#ffff' }} />}
                </div>

                {/* Links Section */}
                <div className={`links-section columns-${limitedColumns.length}`}>
                    {limitedColumns.map((column, index) => (
                        <div key={index} className="column">
                            <h4 className="column-title">{column.title}</h4>
                            <ul className="link-list">
                                {column.links.map((link, i) => (
                                    console.log(link),
                                    <li key={i} className="link-item">
                                        <a href={link.url?.cached_url} className="link">
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter and Social Links Section */}
                <div className="newsletter-section">
                    <input
                        type="email"
                        placeholder={newsletter_placeholder}
                        className="email-input"
                    />
                    <button className="send-button">&#9654;</button>
                    <div className="social-icons">
                        {social_links.map((social, index) => (
                            <a
                                key={index}
                                href={social.url?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                            >
                                <img
                                    src={social.icon?.filename}
                                    alt={social.name || 'Social Icon'}
                                    className="icon-image"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            {/* Scoped styles */}
            <style jsx>{`
                .footer {
                    margin-top: 100px;
                    display: flex;
                    position: relative;
                    color: #fff;
                    padding: 90px 196px;
                    width: 100%;
                    overflow: hidden;
                }

                .footer::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url(${background?.filename});
                    background-size: cover;
                    background-position: center;
                    z-index: 0;
                }

                .footer::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: black;
                    z-index: 1;
                    opacity: 0.9;
                }

                .content-layer {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    gap: 111px; /* Ensure spacing between sections */
                    position: relative;
                    z-index: 2; /* Above the pseudo-elements */
                }

                .brand-section {
                    flex: 1 1 25%; /* Restrict branding section to a quarter of the width */
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                    gap: 20px; /* Ensure spacing within branding section */
                    text-align: left;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .logo-image {
                    width: 288px;
                    height: 100%;
                    //border-radius: 50%;
                }

                .links-section {
                    display: flex;
                    flex: 1 1 50%; /* Allow links section to take half the width */
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: space-between;
                }

                .links-section.columns-3 {
                    justify-content: space-around;
                }

                .links-section.columns-4 {
                    justify-content: space-between;
                }

                .links-section.columns-5 {
                    justify-content: space-between;
                }

                .column {
                    text-align: left;
                    flex: 1 1 calc(20% - 10px); /* Distribute evenly */
                }

                @media (max-width: 768px) {
                    .column {
                        flex: 1 1 100%; /* Stack columns on small screens */
                        margin-bottom: 20px;
                    }
                }

                .column-title {
                    font-size: 20px;
                    font-weight: 500;
                    margin-bottom: 20px;
                    text-transform: uppercase;
                }

                .link-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .link-item {
                    margin-bottom: 8px;
                }

                .link {
                    color: #fff;
                    //text-decoration: none;
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 40px;
                }

                .newsletter-section {
                    text-align: right;
                }

                .email-input {

                    background: #FFFFFF;

                    padding: 15px 20px;
                    font-size: 16px;
                    font-family: 'Calibri', sans-serif;
                    color: ${p => p.theme.text.subtitle};

                    border: 1px solid #fff;
                    margin-right: 10px;
                }

                .send-button {
                    padding: 10px 15px;
                    font-size: 14px;
                    border-radius: 50%;
                    border: none;
                    background-color: #c00;
                    color: #fff;
                    cursor: pointer;
                }

                .social-icons {
                    margin-top: 20px;
                    display: flex;
                    justify-content: flex-start;
                    gap: 15px;
                }

                .social-icon {
                    display: inline-block;
                    width: 42px;
                    height: 42px;
                }

                .icon-image {
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
